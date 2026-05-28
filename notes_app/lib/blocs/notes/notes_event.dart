import 'package:equatable/equatable.dart';
import '../../models/models.dart';

abstract class NotesEvent extends Equatable {
  const NotesEvent();

  @override
  List<Object?> get props => [];
}

class LoadNotes extends NotesEvent {}

class AddNote extends NotesEvent {
  final Note note;
  const AddNote(this.note);
  @override
  List<Object?> get props => [note];
}

class UpdateNote extends NotesEvent {
  final Note note;
  const UpdateNote(this.note);
  @override
  List<Object?> get props => [note];
}

class DeleteNote extends NotesEvent {
  final String id;
  const DeleteNote(this.id);
  @override
  List<Object?> get props => [id];
}

class DeletePermanently extends NotesEvent {
  final String id;
  const DeletePermanently(this.id);
  @override
  List<Object?> get props => [id];
}

class EmptyTrash extends NotesEvent {}

class ToggleFavorite extends NotesEvent {
  final String id;
  const ToggleFavorite(this.id);
  @override
  List<Object?> get props => [id];
}

class TogglePin extends NotesEvent {
  final String id;
  const TogglePin(this.id);
  @override
  List<Object?> get props => [id];
}

class RestoreNote extends NotesEvent {
  final String id;
  const RestoreNote(this.id);
  @override
  List<Object?> get props => [id];
}

class SearchNotes extends NotesEvent {
  final String query;
  const SearchNotes(this.query);
  @override
  List<Object?> get props => [query];
}

class FilterByCategory extends NotesEvent {
  final String? categoryId; // null means show all
  const FilterByCategory(this.categoryId);
  @override
  List<Object?> get props => [categoryId];
}
