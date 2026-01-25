@extends('layout')

@section('title', 'ボード編集')

@push('vite')
@vite('resources/js/components/page/board_form/board_edit.page.tsx')
@endpush

@section('app-attributes')
data-board-id="{{ $id }}"
@endsection
