import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../blocs/notes/notes_bloc.dart';
import '../../blocs/notes/notes_state.dart';
import '../../blocs/notes/notes_event.dart';
import '../../mock/mock_data.dart';
import '../../models/models.dart';

class CategoryScreen extends StatelessWidget {
  const CategoryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Categories'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add_circle_outline),
            onPressed: () => _showAddCategoryDialog(context),
            tooltip: 'Add Category',
          ),
        ],
      ),
      body: BlocBuilder<NotesBloc, NotesState>(
        builder: (context, state) {
          final categories = MockData.categories;
          final selectedId = state.selectedCategoryId;

          return Column(
            children: [
              // Filter chips row
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 12, 16, 4),
                child: SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: [
                      _buildFilterChip(
                        context,
                        label: 'All',
                        isSelected: selectedId == null,
                        onSelected: () {
                          context
                              .read<NotesBloc>()
                              .add(const FilterByCategory(null));
                        },
                      ),
                      ...categories.map((cat) => _buildFilterChip(
                            context,
                            label: cat.name,
                            color: Color(cat.colorValue),
                            isSelected: selectedId == cat.id,
                            onSelected: () {
                              context
                                  .read<NotesBloc>()
                                  .add(FilterByCategory(cat.id));
                            },
                          )),
                    ],
                  ),
                ),
              ),
              // Category grid
              Expanded(
                child: GridView.builder(
                  padding: const EdgeInsets.all(16),
                  gridDelegate:
                      const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    crossAxisSpacing: 16,
                    mainAxisSpacing: 16,
                    childAspectRatio: 1.1,
                  ),
                  itemCount: categories.length,
                  itemBuilder: (context, index) {
                    final category = categories[index];
                    final noteCount =
                        state.notesCountForCategory(category.id);
                    final isSelected = selectedId == category.id;
                    return _CategoryCard(
                      category: category,
                      noteCount: noteCount,
                      isSelected: isSelected,
                      onTap: () {
                        if (isSelected) {
                          context
                              .read<NotesBloc>()
                              .add(const FilterByCategory(null));
                        } else {
                          context
                              .read<NotesBloc>()
                              .add(FilterByCategory(category.id));
                        }
                        // Navigate back to home to see filtered notes
                        context.go('/home');
                      },
                    ).animate().fade(delay: (index * 80).ms).slideY(
                        begin: 0.2, delay: (index * 80).ms);
                  },
                ),
              ),
            ],
          );
        },
      ),
    );
  }

  Widget _buildFilterChip(
    BuildContext context, {
    required String label,
    required bool isSelected,
    required VoidCallback onSelected,
    Color? color,
  }) {
    final chipColor = color ?? Theme.of(context).colorScheme.primary;
    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: FilterChip(
        label: Text(label),
        selected: isSelected,
        onSelected: (_) => onSelected(),
        selectedColor: chipColor.withOpacity(0.25),
        checkmarkColor: chipColor,
        labelStyle: TextStyle(
          color: isSelected ? chipColor : null,
          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
        ),
        side: BorderSide(
          color: isSelected ? chipColor : Colors.grey.shade300,
        ),
      ),
    );
  }

  void _showAddCategoryDialog(BuildContext context) {
    final nameController = TextEditingController();
    Color selectedColor = Colors.indigo;

    final colors = [
      Colors.indigo,
      Colors.purple,
      Colors.amber,
      Colors.teal,
      Colors.pink,
      Colors.orange,
      Colors.green,
      Colors.blue,
    ];

    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setState) => AlertDialog(
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
          title: const Text('Add Category'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: nameController,
                decoration: InputDecoration(
                  labelText: 'Category Name',
                  border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(12)),
                ),
              ),
              const SizedBox(height: 16),
              const Align(
                alignment: Alignment.centerLeft,
                child: Text('Color',
                    style: TextStyle(fontWeight: FontWeight.w600)),
              ),
              const SizedBox(height: 8),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: colors.map((color) {
                  return GestureDetector(
                    onTap: () => setState(() => selectedColor = color),
                    child: Container(
                      width: 32,
                      height: 32,
                      decoration: BoxDecoration(
                        color: color,
                        shape: BoxShape.circle,
                        border: Border.all(
                          color: selectedColor == color
                              ? Colors.black
                              : Colors.transparent,
                          width: 2,
                        ),
                        boxShadow: selectedColor == color
                            ? [
                                BoxShadow(
                                    color: color.withOpacity(0.4),
                                    blurRadius: 8)
                              ]
                            : [],
                      ),
                    ),
                  );
                }).toList(),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(ctx).pop(),
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              onPressed: () {
                if (nameController.text.trim().isNotEmpty) {
                  // In a real app: add to repository/bloc
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(
                          '"${nameController.text.trim()}" category added'),
                      behavior: SnackBarBehavior.floating,
                      shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12)),
                    ),
                  );
                  Navigator.of(ctx).pop();
                }
              },
              child: const Text('Add'),
            ),
          ],
        ),
      ),
    );
  }
}

class _CategoryCard extends StatelessWidget {
  final Category category;
  final int noteCount;
  final bool isSelected;
  final VoidCallback onTap;

  const _CategoryCard({
    required this.category,
    required this.noteCount,
    required this.isSelected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    final color = Color(category.colorValue);
    return Card(
      elevation: isSelected ? 8 : 2,
      shadowColor: color.withOpacity(0.4),
      color: isSelected
          ? color.withOpacity(0.15)
          : Theme.of(context).cardColor,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(20),
        side: BorderSide(
          color: isSelected ? color : Colors.transparent,
          width: 2,
        ),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(20),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.15),
                  shape: BoxShape.circle,
                ),
                child: Icon(category.icon, size: 32, color: color),
              ),
              const SizedBox(height: 12),
              Text(
                category.name,
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                  color: color,
                ),
                textAlign: TextAlign.center,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 4),
              Text(
                '$noteCount ${noteCount == 1 ? 'Note' : 'Notes'}',
                style: TextStyle(
                  fontSize: 12,
                  color: Colors.grey.shade600,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
