import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import '../../models/models.dart';
import '../../blocs/notes/notes_bloc.dart';
import '../../blocs/notes/notes_event.dart';
import 'package:intl/intl.dart';

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
    return Scaffold(
      backgroundColor: Color(_currentNote.colorValue),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.black87),
        actions: [
          IconButton(
            icon: Icon(_currentNote.isPinned ? Icons.push_pin : Icons.push_pin_outlined),
            onPressed: () {
              context.read<NotesBloc>().add(TogglePin(_currentNote.id));
              setState(() => _currentNote = _currentNote.copyWith(isPinned: !_currentNote.isPinned));
            },
          ),
          IconButton(
            icon: Icon(_currentNote.isFavorite ? Icons.favorite : Icons.favorite_outline, 
              color: _currentNote.isFavorite ? Colors.red : Colors.black87),
            onPressed: () {
              context.read<NotesBloc>().add(ToggleFavorite(_currentNote.id));
              setState(() => _currentNote = _currentNote.copyWith(isFavorite: !_currentNote.isFavorite));
            },
          ),
          IconButton(
            icon: const Icon(Icons.delete_outline),
            onPressed: () {
              context.read<NotesBloc>().add(DeleteNote(_currentNote.id));
              context.pop();
            },
          ),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                _currentNote.title,
                style: const TextStyle(fontSize: 32, fontWeight: FontWeight.bold, color: Colors.black87),
              ),
              const SizedBox(height: 8),
              Text(
                DateFormat('MMM dd, yyyy - hh:mm a').format(_currentNote.updatedAt),
                style: const TextStyle(color: Colors.black54),
              ),
              const SizedBox(height: 24),
              Text(
                _currentNote.content,
                style: const TextStyle(fontSize: 18, color: Colors.black87, height: 1.5),
              ),
            ],
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          // Nav to edit note screen (not fully implemented, could reuse CreateNoteScreen but pass the note)
        },
        backgroundColor: Colors.white,
        child: const Icon(Icons.edit, color: Colors.black87),
      ),
    );
  }
}
