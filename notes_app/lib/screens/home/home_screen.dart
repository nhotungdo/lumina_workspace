import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_staggered_grid_view/flutter_staggered_grid_view.dart';
import '../../blocs/notes/notes_bloc.dart';
import '../../blocs/notes/notes_state.dart';
import '../../blocs/notes/notes_event.dart';
import '../../widgets/note_card.dart';
import '../../widgets/bottom_nav_bar.dart';
import '../../mock/mock_data.dart';
import 'package:flutter_animate/flutter_animate.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  void initState() {
    super.initState();
    context.read<NotesBloc>().add(LoadNotes());
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('My Notes'),
        actions: [
          IconButton(
            icon: CircleAvatar(
              backgroundImage: NetworkImage(MockData.currentUser.avatarUrl),
              radius: 16,
            ),
            onPressed: () => context.go('/profile'),
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: BlocBuilder<NotesBloc, NotesState>(
        builder: (context, state) {
          if (state.status == NotesStatus.loading) {
            return const Center(child: CircularProgressIndicator());
          }
          if (state.activeNotes.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.note_add, size: 80, color: Colors.grey.shade400),
                  const SizedBox(height: 16),
                  Text('No notes yet', style: Theme.of(context).textTheme.titleLarge),
                ],
              ),
            );
          }

          final pinned = state.pinnedNotes;
          final unpinned = state.unpinnedNotes;

          return CustomScrollView(
            slivers: [
              if (pinned.isNotEmpty) ...[
                const SliverToBoxAdapter(
                  child: Padding(
                    padding: EdgeInsets.fromLTRB(16, 16, 16, 8),
                    child: Text('PINNED', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.grey)),
                  ),
                ),
                SliverPadding(
                  padding: const EdgeInsets.symmetric(horizontal: 8),
                  sliver: SliverMasonryGrid.count(
                    crossAxisCount: MediaQuery.of(context).size.width > 600 ? 3 : 2,
                    childCount: pinned.length,
                    itemBuilder: (context, index) => NoteCard(note: pinned[index]),
                  ),
                ),
              ],
              if (unpinned.isNotEmpty) ...[
                const SliverToBoxAdapter(
                  child: Padding(
                    padding: EdgeInsets.fromLTRB(16, 16, 16, 8),
                    child: Text('OTHERS', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.grey)),
                  ),
                ),
                SliverPadding(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
                  sliver: SliverMasonryGrid.count(
                    crossAxisCount: MediaQuery.of(context).size.width > 600 ? 3 : 2,
                    childCount: unpinned.length,
                    itemBuilder: (context, index) => NoteCard(note: unpinned[index]),
                  ),
                ),
              ],
            ],
          ).animate().fade();
        },
      ),
      floatingActionButton: FloatingActionButton.large(
        onPressed: () => context.push('/create-note'),
        backgroundColor: Theme.of(context).colorScheme.primary,
        child: const Icon(Icons.add, color: Colors.white, size: 36),
      ).animate().scale(delay: 400.ms),
      bottomNavigationBar: const BottomNavBar(currentIndex: 0),
    );
  }
}
