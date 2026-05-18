import 'package:equatable/equatable.dart';
import '../../models/models.dart';

enum NotesStatus { initial, loading, success, failure }

class NotesState extends Equatable {
  final NotesStatus status;
  final List<Note> notes;
  final List<Note> searchResults;
  final String searchQuery;
  final String? errorMessage;

  const NotesState({
    this.status = NotesStatus.initial,
    this.notes = const [],
    this.searchResults = const [],
    this.searchQuery = '',
    this.errorMessage,
  });

  NotesState copyWith({
    NotesStatus? status,
    List<Note>? notes,
    List<Note>? searchResults,
    String? searchQuery,
    String? errorMessage,
  }) {
    return NotesState(
      status: status ?? this.status,
      notes: notes ?? this.notes,
      searchResults: searchResults ?? this.searchResults,
      searchQuery: searchQuery ?? this.searchQuery,
      errorMessage: errorMessage ?? this.errorMessage,
    );
  }

  List<Note> get activeNotes => notes.where((n) => !n.isDeleted).toList();
  List<Note> get pinnedNotes => activeNotes.where((n) => n.isPinned).toList();
  List<Note> get unpinnedNotes => activeNotes.where((n) => !n.isPinned).toList();
  List<Note> get favoriteNotes => activeNotes.where((n) => n.isFavorite).toList();
  List<Note> get trashNotes => notes.where((n) => n.isDeleted).toList();
  List<Note> get reminderNotes => activeNotes.where((n) => n.reminder != null).toList();

  @override
  List<Object?> get props => [status, notes, searchResults, searchQuery, errorMessage];
}
