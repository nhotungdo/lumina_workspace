import 'package:equatable/equatable.dart';
import '../../models/models.dart';

enum NotesStatus { initial, loading, success, failure }

class NotesState extends Equatable {
  final NotesStatus status;
  final List<Note> notes;
  final List<Note> searchResults;
  final String searchQuery;
  final String? errorMessage;
  final String? selectedCategoryId;

  const NotesState({
    this.status = NotesStatus.initial,
    this.notes = const [],
    this.searchResults = const [],
    this.searchQuery = '',
    this.errorMessage,
    this.selectedCategoryId,
  });

  NotesState copyWith({
    NotesStatus? status,
    List<Note>? notes,
    List<Note>? searchResults,
    String? searchQuery,
    String? errorMessage,
    String? selectedCategoryId,
    bool clearCategory = false,
  }) {
    return NotesState(
      status: status ?? this.status,
      notes: notes ?? this.notes,
      searchResults: searchResults ?? this.searchResults,
      searchQuery: searchQuery ?? this.searchQuery,
      errorMessage: errorMessage ?? this.errorMessage,
      selectedCategoryId:
          clearCategory ? null : selectedCategoryId ?? this.selectedCategoryId,
    );
  }

  List<Note> get activeNotes => notes.where((n) => !n.isDeleted).toList();
  List<Note> get pinnedNotes => activeNotes.where((n) => n.isPinned).toList();
  List<Note> get unpinnedNotes =>
      activeNotes.where((n) => !n.isPinned).toList();
  List<Note> get favoriteNotes =>
      activeNotes.where((n) => n.isFavorite).toList();
  List<Note> get trashNotes => notes.where((n) => n.isDeleted).toList();
  List<Note> get reminderNotes =>
      activeNotes.where((n) => n.reminder != null).toList();

  /// Returns notes filtered by selected category. Falls back to all active notes.
  List<Note> get filteredNotes {
    if (selectedCategoryId == null) return activeNotes;
    return activeNotes
        .where((n) => n.categoryId == selectedCategoryId)
        .toList();
  }

  List<Note> get filteredPinnedNotes =>
      filteredNotes.where((n) => n.isPinned).toList();
  List<Note> get filteredUnpinnedNotes =>
      filteredNotes.where((n) => !n.isPinned).toList();

  /// Returns number of active (non-deleted) notes for a given category id.
  int notesCountForCategory(String categoryId) =>
      activeNotes.where((n) => n.categoryId == categoryId).length;

  @override
  List<Object?> get props =>
      [status, notes, searchResults, searchQuery, errorMessage, selectedCategoryId];
}
