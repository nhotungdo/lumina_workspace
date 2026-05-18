import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_staggered_grid_view/flutter_staggered_grid_view.dart';
import '../../blocs/notes/notes_bloc.dart';
import '../../blocs/notes/notes_state.dart';
import '../../widgets/note_card.dart';
import '../../widgets/bottom_nav_bar.dart';
import '../../widgets/empty_widget.dart';

class FavoriteScreen extends StatelessWidget {
  const FavoriteScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Favorites'),
      ),
      body: BlocBuilder<NotesBloc, NotesState>(
        builder: (context, state) {
          final favorites = state.favoriteNotes;
          if (favorites.isEmpty) {
            return const EmptyWidget(
              icon: Icons.favorite_border,
              title: 'No Favorites Yet',
              subtitle: 'Mark a note as favorite to see it here',
            );
          }

          return MasonryGridView.count(
            padding: const EdgeInsets.all(8),
            crossAxisCount: MediaQuery.of(context).size.width > 600 ? 3 : 2,
            itemCount: favorites.length,
            itemBuilder: (context, index) {
              return NoteCard(note: favorites[index]);
            },
          );
        },
      ),
      bottomNavigationBar: const BottomNavBar(currentIndex: 3),
    );
  }
}
