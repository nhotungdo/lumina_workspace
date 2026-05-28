import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import '../../models/models.dart';
import '../../blocs/notes/notes_bloc.dart';
import '../../blocs/notes/notes_event.dart';

class NoteDetailScreen extends StatefulWidget {
  final Note note;
  const NoteDetailScreen({super.key, required this.note});

  @override
  State<NoteDetailScreen> createState() => _NoteDetailScreenState();
}

class _NoteDetailScreenState extends State<NoteDetailScreen> {
  late Note _currentNote;

  @override
  void initState() {
    super.initState();
    _currentNote = widget.note;
  }

  @override
  Widget build(BuildContext context) {
    final textColor = _contrastColor(_currentNote.colorValue);

    return Scaffold(
      backgroundColor: Color(_currentNote.colorValue),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        iconTheme: IconThemeData(color: textColor),
        actions: [
          IconButton(
            icon: Icon(
                _currentNote.isPinned ? Icons.push_pin : Icons.push_pin_outlined),
            onPressed: () {
              context.read<NotesBloc>().add(TogglePin(_currentNote.id));
              setState(() =>
                  _currentNote = _currentNote.copyWith(isPinned: !_currentNote.isPinned));
            },
          ),
          IconButton(
            icon: Icon(
                _currentNote.isFavorite ? Icons.favorite : Icons.favorite_outline,
                color: _currentNote.isFavorite ? Colors.red : textColor),
            onPressed: () {
              context.read<NotesBloc>().add(ToggleFavorite(_currentNote.id));
              setState(() => _currentNote =
                  _currentNote.copyWith(isFavorite: !_currentNote.isFavorite));
            },
          ),
          IconButton(
            icon: Icon(Icons.delete_outline, color: textColor),
            onPressed: () {
              context.read<NotesBloc>().add(DeleteNote(_currentNote.id));
              context.pop();
            },
          ),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(24, 0, 24, 100),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                _currentNote.title.isEmpty ? 'Untitled' : _currentNote.title,
                style: TextStyle(
                    fontSize: 32,
                    fontWeight: FontWeight.bold,
                    color: textColor),
              ),
              const SizedBox(height: 8),
              Text(
                DateFormat('MMM dd, yyyy · hh:mm a').format(_currentNote.updatedAt),
                style: TextStyle(color: textColor.withOpacity(0.6), fontSize: 13),
              ),
              // Reminder badge
              if (_currentNote.reminder != null) ...[
                const SizedBox(height: 12),
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.35),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.alarm, size: 16, color: textColor),
                      const SizedBox(width: 6),
                      Text(
                        DateFormat('MMM dd · hh:mm a')
                            .format(_currentNote.reminder!.dateTime),
                        style:
                            TextStyle(fontSize: 13, color: textColor),
                      ),
                    ],
                  ),
                ),
              ],
              // Tags
              if (_currentNote.tags.isNotEmpty) ...[
                const SizedBox(height: 12),
                Wrap(
                  spacing: 6,
                  runSpacing: 6,
                  children: _currentNote.tags
                      .map((tag) => Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: Colors.white.withOpacity(0.35),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Text(tag,
                                style: TextStyle(
                                    fontSize: 12, color: textColor)),
                          ))
                      .toList(),
                ),
              ],
              const SizedBox(height: 24),
              Text(
                _currentNote.content,
                style: TextStyle(
                    fontSize: 18, color: textColor.withOpacity(0.85), height: 1.6),
              ),
            ],
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () async {
          // Navigate to CreateNoteScreen in edit mode, await result (updated note)
          final result = await context.push<Note>(
            '/create-note',
            extra: _currentNote,
          );
          if (result != null) {
            setState(() => _currentNote = result);
          }
        },
        backgroundColor: Colors.white,
        foregroundColor: Colors.black87,
        child: const Icon(Icons.edit_rounded),
      ),
    );
  }

  Color _contrastColor(int colorValue) {
    final c = Color(colorValue);
    final luminance = 0.299 * c.r + 0.587 * c.g + 0.114 * c.b;
    return luminance > 0.6 ? Colors.black87 : Colors.white;
  }
}
