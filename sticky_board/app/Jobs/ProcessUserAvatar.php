<?php

namespace App\Jobs;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Support\Facades\Log;

class ProcessUserAvatar implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        private int $userId,
        private string $tempPath,
    ) {}

    public function handle(): void
    {
        Log::info('avatar job start', [
            'userId' => $this->userId,
            'tempPath' => $this->tempPath,
        ]);

        $user = User::find($this->userId);
        if (!$user) {
            Log::warning('avatar job abort: user not found', [
                'userId' => $this->userId,
            ]);
            return;
        }

        if (!Storage::disk('local')->exists($this->tempPath)) {
            Log::warning('avatar job abort: temp file missing', [
                'userId' => $this->userId,
                'tempPath' => $this->tempPath,
            ]);
            return;
        }

        $tempFullPath = Storage::disk('local')->path($this->tempPath);
        $fileName = 'avatar_' . $user->id . '_' . Str::random(10) . '.png';
        $destPath = 'avatars/' . $fileName;

        $manager = new ImageManager(new Driver());
        $image = $manager->read($tempFullPath)->cover(256, 256);
        $gdImage = $image->core()->native();

        if (!is_resource($gdImage) && !$gdImage instanceof \GdImage) {
            Log::warning('avatar job abort: invalid GD image', [
                'userId' => $this->userId,
            ]);
            return;
        }

        $size = imagesx($gdImage);
        $radius = $size / 2;
        $center = $radius;

        $dest = imagecreatetruecolor($size, $size);
        imagesavealpha($dest, true);
        $transparent = imagecolorallocatealpha($dest, 0, 0, 0, 127);
        imagefill($dest, 0, 0, $transparent);

        for ($y = 0; $y < $size; $y++) {
            for ($x = 0; $x < $size; $x++) {
                $dx = $x - $center + 0.5;
                $dy = $y - $center + 0.5;
                if (($dx * $dx) + ($dy * $dy) <= ($radius * $radius)) {
                    $color = imagecolorat($gdImage, $x, $y);
                    imagesetpixel($dest, $x, $y, $color);
                }
            }
        }

        ob_start();
        imagepng($dest);
        $pngData = ob_get_clean();

        imagedestroy($dest);
        if (is_resource($gdImage) || $gdImage instanceof \GdImage) {
            imagedestroy($gdImage);
        }

        if ($pngData === false) {
            Log::warning('avatar job abort: png encode failed', [
                'userId' => $this->userId,
            ]);
            return;
        }

        Storage::disk('public')->put($destPath, $pngData);

        // 古いURLを退避（DBに入ってる http://localhost/storage/... のやつ）
        $previousAvatarUrl = $user->avatar;

        // DB更新（新しいURL）
        $user->avatar = Storage::disk('public')->url($destPath);
        $user->save();

        // temp削除
        Storage::disk('local')->delete($this->tempPath);

        // $currentFile = basename($destPath);
        // $files = Storage::disk('public')->files('avatars');

        // foreach ($files as $file) {
        //     if (!str_starts_with(basename($file), 'avatar_' . $user->id . '_')) {
        //         continue;
        //     }
        //     if (basename($file) === $currentFile) {
        //         continue;
        //     }
        //     Storage::disk('public')->delete($file);
        // }
        
        // 古いアバター「だけ」削除（files() で回さない）
        $previousPath = $this->avatarUrlToPublicPath($previousAvatarUrl);

        Log::info('avatar cleanup debug', [
            'previousAvatarUrl' => $previousAvatarUrl,
            'destPath' => $destPath,
            'previousPath' => $previousPath,
            'publicRoot' => config('filesystems.disks.public.root'),
            'previousExists' => $previousPath ? Storage::disk('public')->exists($previousPath) : null,
            'previousAbsPath' => $previousPath ? Storage::disk('public')->path($previousPath) : null,
        ]);

        if ($previousPath && $previousPath !== $destPath && Storage::disk('public')->exists($previousPath)) {
            $deleted = Storage::disk('public')->delete($previousPath);
            Log::info('avatar delete result', [
                'previousPath' => $previousPath,
                'deleted' => $deleted,
            ]);
        } else {
            Log::info('avatar delete skipped', [
                'previousPath' => $previousPath,
                'destPath' => $destPath,
            ]);
        }
    }

    private function avatarUrlToPublicPath(?string $url): ?string
    {
        if (!$url) return null;

        // 例: http://localhost/storage/avatars/avatar_1_xxx.png -> /storage/avatars/avatar_1_xxx.png
        $path = parse_url($url, PHP_URL_PATH);
        if (!$path) return null;

        // /storage/ 以外は対象外（安全ガード）
        if (!Str::startsWith($path, '/storage/')) return null;

        // publicディスク相対パスへ: avatars/avatar_1_xxx.png
        $relative = ltrim(Str::after($path, '/storage/'), '/');

        // avatars 配下だけ削除対象（安全ガード）
        if (!Str::startsWith($relative, 'avatars/')) return null;

        return $relative;
    }
}
