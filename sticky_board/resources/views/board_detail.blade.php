@extends('layout')

@section('title', 'ボード詳細')

@push('vite')
@vite('resources/js/components/page/board_detail/board_detail.page.tsx')
@endpush

@section('app-attributes')
data-board-id="{{ $id }}"
@endsection
