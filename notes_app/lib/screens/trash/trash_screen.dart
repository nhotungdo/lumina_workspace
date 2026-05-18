import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import '../../blocs/notes/notes_bloc.dart';
import '../../blocs/notes/notes_state.dart';
import '../../blocs/notes/notes_event.dart';
import '../../widgets/note_card.dart';
import '../../widgets/empty_widget.dart';

class TrashScreen extends StatelessWidget {
  const TrashScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Trash'),
        actions: [
          TextButton(
            onPressed: () {
              // Empty trash
            },
            child: const Text('Empty', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
      body: BlocBuilder<NotesBloc, NotesState>(
        builder: (context, state) {
          final trashNotes = state.trashNotes;
          if (trashNotes.isEmpty) {
            return const EmptyWidget(
              icon: Icons.delete_outline,
              title: 'Trash is Empty',
              subtitle: 'Deleted notes will appear here',
            );
          }

          return ListView.builder(
            padding: const EdgeInsets.all(8),
            itemCount: trashNotes.length,
            itemBuilder: (context, index) {
              final note = trashNotes[index];
              return Dismissible(
                key: Key(note.id),
                background: Container(
                  color: Colors.green,
                  alignment: Alignment.centerLeft,
                  padding: const EdgeInsets.only(left: 16),
                  child: const Icon(Icons.restore, color: Colors.white),
                ),
                secondaryBackground: Container(
                  color: Colors.red,
                  alignment: Alignment.centerRight,
                  padding: const EdgeInsets.only(right: 16),
                  child: const Icon(Icons.delete_forever, color: Colors.white),
                ),
                onDismissed: (direction) {
                  if (direction == DismissDirection.startToEnd) {
                    context.read<NotesBloc>().add(RestoreNote(note.id));
                    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Note restored')));
                  } else {
                    // Permanently delete
                    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Note deleted permanently')));
                  }
                },
                child: Opacity(
                  opacity: 0.7,
                  child: NoteCard(note: note, onTap: () {}),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
