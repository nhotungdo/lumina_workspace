import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_staggered_grid_view/flutter_staggered_grid_view.dart';
import '../../blocs/notes/notes_bloc.dart';
import '../../blocs/notes/notes_state.dart';
import '../../blocs/notes/notes_event.dart';
import '../../widgets/note_card.dart';
import '../../widgets/bottom_nav_bar.dart';
import '../../widgets/empty_widget.dart';

class SearchScreen extends StatefulWidget {
  const SearchScreen({super.key});

  @override
  State<SearchScreen> createState() => _SearchScreenState();
}

class _SearchScreenState extends State<SearchScreen> {
  final TextEditingController _searchController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: TextField(
          controller: _searchController,
          autofocus: true,
          decoration: const InputDecoration(
            hintText: 'Search notes...',
            border: InputBorder.none,
            enabledBorder: InputBorder.none,
            focusedBorder: InputBorder.none,
            fillColor: Colors.transparent,
            filled: false,
          ),
          onChanged: (value) {
            context.read<NotesBloc>().add(SearchNotes(value));
          },
        ),
      ),
      body: BlocBuilder<NotesBloc, NotesState>(
        builder: (context, state) {
          if (state.searchQuery.isEmpty) {
            return const EmptyWidget(
              icon: Icons.search,
              title: 'Search Notes',
              subtitle: 'Find your notes by title or content',
            );
          }

          if (state.searchResults.isEmpty) {
            return const EmptyWidget(
              icon: Icons.search_off,
              title: 'No Results Found',
              subtitle: 'Try a different keyword',
            );
          }

          return MasonryGridView.count(
            padding: const EdgeInsets.all(8),
            crossAxisCount: MediaQuery.of(context).size.width > 600 ? 3 : 2,
            itemCount: state.searchResults.length,
            itemBuilder: (context, index) {
              return NoteCard(note: state.searchResults[index]);
            },
          );
        },
      ),
      bottomNavigationBar: const BottomNavBar(currentIndex: 1),
    );
  }
}
