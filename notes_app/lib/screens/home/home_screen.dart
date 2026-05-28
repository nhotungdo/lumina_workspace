import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_staggered_grid_view/flutter_staggered_grid_view.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../blocs/notes/notes_bloc.dart';
import '../../blocs/notes/notes_state.dart';
import '../../blocs/notes/notes_event.dart';
import '../../blocs/auth/auth_bloc.dart';
import '../../blocs/auth/auth_state.dart';
import '../../widgets/note_card.dart';
import '../../widgets/bottom_nav_bar.dart';
import '../../widgets/empty_widget.dart';
import '../../mock/mock_data.dart';

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
          // Category filter indicator
          BlocBuilder<NotesBloc, NotesState>(
            builder: (context, state) {
              if (state.selectedCategoryId == null) {
                return const SizedBox.shrink();
              }
              final catName = MockData.categories
                  .firstWhere(
                    (c) => c.id == state.selectedCategoryId,
                    orElse: () => MockData.categories.first,
                  )
                  .name;
              return Chip(
                label: Text(catName,
                    style: const TextStyle(fontSize: 12)),
                onDeleted: () => context
                    .read<NotesBloc>()
                    .add(const FilterByCategory(null)),
                deleteIcon:
                    const Icon(Icons.close, size: 14),
                visualDensity: VisualDensity.compact,
                materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                backgroundColor: Theme.of(context)
                    .colorScheme
                    .primary
                    .withOpacity(0.12),
                side: BorderSide(
                    color: Theme.of(context).colorScheme.primary),
                labelStyle: TextStyle(
                    color: Theme.of(context).colorScheme.primary),
              );
            },
          ),
          const SizedBox(width: 4),
          // Avatar
          BlocBuilder<AuthBloc, AuthState>(
            builder: (context, authState) {
              final avatarUrl = authState.user?.avatarUrl ??
                  'https://i.pravatar.cc/150?u=default';
              return IconButton(
                icon: CircleAvatar(
                  backgroundImage: NetworkImage(avatarUrl),
                  radius: 16,
                  onBackgroundImageError: (_, __) {},
                  child: const Icon(Icons.person, size: 16),
                ),
                onPressed: () => context.push('/profile'),
              );
            },
          ),
          const SizedBox(width: 4),
        ],
      ),
      body: BlocBuilder<NotesBloc, NotesState>(
        builder: (context, state) {
          if (state.status == NotesStatus.loading) {
            return const Center(child: CircularProgressIndicator());
          }

          final filtered = state.filteredNotes;

          if (filtered.isEmpty) {
            return EmptyWidget(
              icon: state.selectedCategoryId != null
                  ? Icons.filter_list_off
                  : Icons.note_add_rounded,
              title: state.selectedCategoryId != null
                  ? 'No notes in this category'
                  : 'No notes yet',
              subtitle: state.selectedCategoryId != null
                  ? 'Try a different category or clear the filter'
                  : 'Tap + to create your first note',
            );
          }

          final pinned =
              filtered.where((n) => n.isPinned).toList();
          final unpinned =
              filtered.where((n) => !n.isPinned).toList();
          final crossAxisCount =
              MediaQuery.of(context).size.width > 600 ? 3 : 2;

          return CustomScrollView(
            slivers: [
              if (pinned.isNotEmpty) ...[
                const SliverToBoxAdapter(
                  child: Padding(
                    padding: EdgeInsets.fromLTRB(16, 16, 16, 8),
                    child: Row(
                      children: [
                        Icon(Icons.push_pin,
                            size: 14, color: Colors.grey),
                        SizedBox(width: 4),
                        Text('PINNED',
                            style: TextStyle(
                                fontWeight: FontWeight.bold,
                                color: Colors.grey,
                                fontSize: 12,
                                letterSpacing: 0.8)),
                      ],
                    ),
                  ),
                ),
                SliverPadding(
                  padding: const EdgeInsets.symmetric(horizontal: 8),
                  sliver: SliverMasonryGrid.count(
                    crossAxisCount: crossAxisCount,
                    childCount: pinned.length,
                    itemBuilder: (context, index) =>
                        NoteCard(note: pinned[index]),
                  ),
                ),
              ],
              if (unpinned.isNotEmpty) ...[
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
                    child: Row(
                      children: [
                        const Icon(Icons.notes,
                            size: 14, color: Colors.grey),
                        const SizedBox(width: 4),
                        Text(
                          pinned.isEmpty ? 'ALL NOTES' : 'OTHERS',
                          style: const TextStyle(
                              fontWeight: FontWeight.bold,
                              color: Colors.grey,
                              fontSize: 12,
                              letterSpacing: 0.8),
                        ),
                      ],
                    ),
                  ),
                ),
                SliverPadding(
                  padding: const EdgeInsets.fromLTRB(8, 0, 8, 100),
                  sliver: SliverMasonryGrid.count(
                    crossAxisCount: crossAxisCount,
                    childCount: unpinned.length,
                    itemBuilder: (context, index) =>
                        NoteCard(note: unpinned[index]),
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
