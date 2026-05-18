import 'package:flutter_bloc/flutter_bloc.dart';
import 'notes_event.dart';
import 'notes_state.dart';
import '../../mock/mock_data.dart';
import '../../models/models.dart';

class NotesBloc extends Bloc<NotesEvent, NotesState> {
  NotesBloc() : super(const NotesState()) {
    on<LoadNotes>(_onLoadNotes);
    on<AddNote>(_onAddNote);
    on<UpdateNote>(_onUpdateNote);
    on<DeleteNote>(_onDeleteNote);
    on<ToggleFavorite>(_onToggleFavorite);
    on<TogglePin>(_onTogglePin);
    on<RestoreNote>(_onRestoreNote);
    on<SearchNotes>(_onSearchNotes);
  }

  void _onLoadNotes(LoadNotes event, Emitter<NotesState> emit) async {
    emit(state.copyWith(status: NotesStatus.loading));
    await Future.delayed(const Duration(milliseconds: 800)); // Simulate network
    emit(state.copyWith(
      status: NotesStatus.success,
      notes: MockData.notes,
    ));
  }

  void _onAddNote(AddNote event, Emitter<NotesState> emit) {
    final updatedNotes = List<Note>.from(state.notes)..insert(0, event.note);
    emit(state.copyWith(notes: updatedNotes));
  }

  void _onUpdateNote(UpdateNote event, Emitter<NotesState> emit) {
    final updatedNotes = state.notes.map((n) => n.id == event.note.id ? event.note : n).toList();
    emit(state.copyWith(notes: updatedNotes));
    _updateSearch(emit, state.searchQuery, updatedNotes);
  }

  void _onDeleteNote(DeleteNote event, Emitter<NotesState> emit) {
    final updatedNotes = state.notes.map((n) {
      if (n.id == event.id) {
        return n.copyWith(isDeleted: true);
      }
      return n;
    }).toList();
    emit(state.copyWith(notes: updatedNotes));
    _updateSearch(emit, state.searchQuery, updatedNotes);
  }

  void _onToggleFavorite(ToggleFavorite event, Emitter<NotesState> emit) {
    final updatedNotes = state.notes.map((n) {
      if (n.id == event.id) {
        return n.copyWith(isFavorite: !n.isFavorite);
      }
      return n;
    }).toList();
    emit(state.copyWith(notes: updatedNotes));
    _updateSearch(emit, state.searchQuery, updatedNotes);
  }

  void _onTogglePin(TogglePin event, Emitter<NotesState> emit) {
    final updatedNotes = state.notes.map((n) {
      if (n.id == event.id) {
        return n.copyWith(isPinned: !n.isPinned);
      }
      return n;
    }).toList();
    emit(state.copyWith(notes: updatedNotes));
    _updateSearch(emit, state.searchQuery, updatedNotes);
  }

  void _onRestoreNote(RestoreNote event, Emitter<NotesState> emit) {
    final updatedNotes = state.notes.map((n) {
      if (n.id == event.id) {
        return n.copyWith(isDeleted: false);
      }
      return n;
    }).toList();
    emit(state.copyWith(notes: updatedNotes));
  }

  void _onSearchNotes(SearchNotes event, Emitter<NotesState> emit) {
    _updateSearch(emit, event.query, state.notes);
  }

  void _updateSearch(Emitter<NotesState> emit, String query, List<Note> notes) {
    if (query.isEmpty) {
      emit(state.copyWith(searchQuery: query, searchResults: []));
      return;
    }
    final lowerQuery = query.toLowerCase();
    final results = notes.where((n) => 
      !n.isDeleted && (n.title.toLowerCase().contains(lowerQuery) || n.content.toLowerCase().contains(lowerQuery))
    ).toList();
    emit(state.copyWith(searchQuery: query, searchResults: results));
  }
}
