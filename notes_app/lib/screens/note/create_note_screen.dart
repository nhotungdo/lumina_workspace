import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:uuid/uuid.dart';
import 'package:intl/intl.dart';
import '../../blocs/notes/notes_bloc.dart';
import '../../blocs/notes/notes_event.dart';
import '../../models/models.dart';
import '../../core/theme/app_colors.dart';
import '../../mock/mock_data.dart';

class CreateNoteScreen extends StatefulWidget {
  /// If non-null, the screen operates in "edit" mode.
  final Note? existingNote;

  const CreateNoteScreen({super.key, this.existingNote});

  @override
  State<CreateNoteScreen> createState() => _CreateNoteScreenState();
}

class _CreateNoteScreenState extends State<CreateNoteScreen> {
  late final TextEditingController _titleController;
  late final TextEditingController _contentController;
  late int _selectedColor;
  late String _selectedCategoryId;
  late List<String> _tags;
  Reminder? _reminder;
  bool get _isEditing => widget.existingNote != null;

  @override
  void initState() {
    super.initState();
    final note = widget.existingNote;
    _titleController = TextEditingController(text: note?.title ?? '');
    _contentController = TextEditingController(text: note?.content ?? '');
    _selectedColor = note?.colorValue ?? AppColors.noteColors[0].value;
    _selectedCategoryId = note?.categoryId ?? MockData.categories.first.id;
    _tags = List<String>.from(note?.tags ?? []);
    _reminder = note?.reminder;
  }

  @override
  void dispose() {
    _titleController.dispose();
    _contentController.dispose();
    super.dispose();
  }

  void _saveNote() {
    if (_titleController.text.isEmpty && _contentController.text.isEmpty) {
      context.pop();
      return;
    }

    if (_isEditing) {
      final updatedNote = widget.existingNote!.copyWith(
        title: _titleController.text,
        content: _contentController.text,
        updatedAt: DateTime.now(),
        categoryId: _selectedCategoryId,
        colorValue: _selectedColor,
        tags: _tags,
        reminder: _reminder,
      );
      context.read<NotesBloc>().add(UpdateNote(updatedNote));
      // Return updated note to caller (NoteDetailScreen)
      context.pop(updatedNote);
    } else {
      final newNote = Note(
        id: const Uuid().v4(),
        title: _titleController.text,
        content: _contentController.text,
        createdAt: DateTime.now(),
        updatedAt: DateTime.now(),
        categoryId: _selectedCategoryId,
        colorValue: _selectedColor,
        tags: _tags,
        reminder: _reminder,
      );
      context.read<NotesBloc>().add(AddNote(newNote));
      context.pop();
    }
  }

  @override
  Widget build(BuildContext context) {
    final textColor = _contrastColor(_selectedColor);

    return Scaffold(
      backgroundColor: Color(_selectedColor),
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        iconTheme: IconThemeData(color: textColor),
        title: Text(
          _isEditing ? 'Edit Note' : 'New Note',
          style: TextStyle(color: textColor, fontWeight: FontWeight.bold),
        ),
        actions: [
          IconButton(
            icon: Icon(Icons.check_circle_rounded, color: textColor),
            onPressed: _saveNote,
            tooltip: 'Save',
          ),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(20, 0, 20, 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Title field
              TextField(
                controller: _titleController,
                style: TextStyle(
                    fontSize: 28,
                    fontWeight: FontWeight.bold,
                    color: textColor),
                decoration: InputDecoration(
                  hintText: 'Title',
                  hintStyle:
                      TextStyle(color: textColor.withOpacity(0.4)),
                  border: InputBorder.none,
                  enabledBorder: InputBorder.none,
                  focusedBorder: InputBorder.none,
                ),
                textCapitalization: TextCapitalization.sentences,
              ),

              // Metadata toolbar
              Container(
                margin: const EdgeInsets.symmetric(vertical: 8),
                child: SingleChildScrollView(
                  scrollDirection: Axis.horizontal,
                  child: Row(
                    children: [
                      _ToolbarChip(
                        icon: Icons.color_lens_rounded,
                        label: 'Color',
                        color: textColor,
                        onTap: _showColorPicker,
                      ),
                      const SizedBox(width: 8),
                      _ToolbarChip(
                        icon: Icons.category_rounded,
                        label: _categoryName(_selectedCategoryId),
                        color: textColor,
                        onTap: _showCategoryPicker,
                      ),
                      const SizedBox(width: 8),
                      _ToolbarChip(
                        icon: Icons.alarm_rounded,
                        label: _reminder == null
                            ? 'Reminder'
                            : DateFormat('MMM dd · hh:mm a')
                                .format(_reminder!.dateTime),
                        color: textColor,
                        onTap: _showReminderPicker,
                        hasValue: _reminder != null,
                      ),
                    ],
                  ),
                ),
              ),

              // Divider
              Divider(color: textColor.withOpacity(0.2)),
              const SizedBox(height: 8),

              // Content field
              TextField(
                controller: _contentController,
                style: TextStyle(
                    fontSize: 17,
                    color: textColor.withOpacity(0.85),
                    height: 1.6),
                maxLines: null,
                keyboardType: TextInputType.multiline,
                textCapitalization: TextCapitalization.sentences,
                decoration: InputDecoration(
                  hintText: 'Start typing...',
                  hintStyle:
                      TextStyle(color: textColor.withOpacity(0.35)),
                  border: InputBorder.none,
                  enabledBorder: InputBorder.none,
                  focusedBorder: InputBorder.none,
                ),
              ),

              const SizedBox(height: 24),

              // Tags section
              _TagsSection(
                tags: _tags,
                textColor: textColor,
                onAdd: (tag) => setState(() => _tags.add(tag)),
                onRemove: (tag) => setState(() => _tags.remove(tag)),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ─── Color Picker ───────────────────────────────────────────────────────────
  void _showColorPicker() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (ctx) {
        return Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Note Color',
                  style: TextStyle(
                      fontSize: 18, fontWeight: FontWeight.bold)),
              const SizedBox(height: 16),
              GridView.builder(
                shrinkWrap: true,
                gridDelegate:
                    const SliverGridDelegateWithFixedCrossAxisCount(
                  crossAxisCount: 4,
                  crossAxisSpacing: 12,
                  mainAxisSpacing: 12,
                  childAspectRatio: 1,
                ),
                itemCount: AppColors.noteColors.length,
                itemBuilder: (_, i) {
                  final color = AppColors.noteColors[i];
                  final isSelected = color.value == _selectedColor;
                  return GestureDetector(
                    onTap: () {
                      setState(() => _selectedColor = color.value);
                      Navigator.pop(ctx);
                    },
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 200),
                      decoration: BoxDecoration(
                        color: color,
                        shape: BoxShape.circle,
                        border: Border.all(
                          color: isSelected
                              ? Colors.black
                              : Colors.transparent,
                          width: 3,
                        ),
                        boxShadow: isSelected
                            ? [
                                BoxShadow(
                                    color: color.withOpacity(0.5),
                                    blurRadius: 12)
                              ]
                            : [],
                      ),
                      child: isSelected
                          ? const Icon(Icons.check, color: Colors.black54)
                          : null,
                    ),
                  );
                },
              ),
            ],
          ),
        );
      },
    );
  }

  // ─── Category Picker ─────────────────────────────────────────────────────────
  void _showCategoryPicker() {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (ctx) {
        return Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Select Category',
                  style: TextStyle(
                      fontSize: 18, fontWeight: FontWeight.bold)),
              const SizedBox(height: 16),
              ...MockData.categories.map((cat) {
                final isSelected = cat.id == _selectedCategoryId;
                final catColor = Color(cat.colorValue);
                return ListTile(
                  leading: CircleAvatar(
                    backgroundColor: catColor.withOpacity(0.15),
                    child: Icon(cat.icon, color: catColor),
                  ),
                  title: Text(cat.name,
                      style: TextStyle(
                          fontWeight: isSelected
                              ? FontWeight.bold
                              : FontWeight.normal)),
                  trailing: isSelected
                      ? Icon(Icons.check_circle, color: catColor)
                      : null,
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(12)),
                  onTap: () {
                    setState(() => _selectedCategoryId = cat.id);
                    Navigator.pop(ctx);
                  },
                );
              }),
            ],
          ),
        );
      },
    );
  }

  // ─── Reminder Picker ─────────────────────────────────────────────────────────
  void _showReminderPicker() async {
    final now = DateTime.now();

    // Pick date
    final date = await showDatePicker(
      context: context,
      initialDate: _reminder?.dateTime ?? now.add(const Duration(hours: 1)),
      firstDate: now,
      lastDate: now.add(const Duration(days: 365)),
      builder: (ctx, child) => Theme(
        data: Theme.of(ctx).copyWith(
          colorScheme: ColorScheme.light(
              primary: Theme.of(ctx).colorScheme.primary),
        ),
        child: child!,
      ),
    );
    if (date == null || !mounted) return;

    // Pick time
    final time = await showTimePicker(
      context: context,
      initialTime: TimeOfDay.fromDateTime(
          _reminder?.dateTime ?? now.add(const Duration(hours: 1))),
    );
    if (time == null || !mounted) return;

    final dateTime = DateTime(
        date.year, date.month, date.day, time.hour, time.minute);

    // Pick repeat mode
    String repeatMode = _reminder?.repeatMode ?? 'none';
    if (mounted) {
      repeatMode = await _showRepeatPicker() ?? repeatMode;
    }

    setState(() {
      _reminder = Reminder(dateTime: dateTime, repeatMode: repeatMode);
    });
  }

  Future<String?> _showRepeatPicker() async {
    return showDialog<String>(
      context: context,
      builder: (ctx) => SimpleDialog(
        shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(20)),
        title: const Text('Repeat'),
        children: [
          _repeatOption(ctx, 'none', 'No Repeat', Icons.block),
          _repeatOption(ctx, 'daily', 'Daily', Icons.today),
          _repeatOption(ctx, 'weekly', 'Weekly', Icons.view_week),
          _repeatOption(ctx, 'monthly', 'Monthly', Icons.calendar_month),
          if (_reminder != null)
            Padding(
              padding:
                  const EdgeInsets.fromLTRB(24, 8, 24, 0),
              child: TextButton.icon(
                icon: const Icon(Icons.alarm_off, color: Colors.red),
                label: const Text('Remove Reminder',
                    style: TextStyle(color: Colors.red)),
                onPressed: () {
                  setState(() => _reminder = null);
                  Navigator.of(ctx).pop('none');
                },
              ),
            ),
        ],
      ),
    );
  }

  Widget _repeatOption(
      BuildContext ctx, String value, String label, IconData icon) {
    return SimpleDialogOption(
      padding:
          const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
      onPressed: () => Navigator.of(ctx).pop(value),
      child: Row(
        children: [
          Icon(icon, size: 20, color: Theme.of(ctx).colorScheme.primary),
          const SizedBox(width: 12),
          Text(label, style: const TextStyle(fontSize: 16)),
        ],
      ),
    );
  }

  String _categoryName(String id) {
    try {
      return MockData.categories.firstWhere((c) => c.id == id).name;
    } catch (_) {
      return 'Category';
    }
  }

  Color _contrastColor(int colorValue) {
    final c = Color(colorValue);
    final luminance =
        (0.299 * c.red + 0.587 * c.green + 0.114 * c.blue) / 255;
    return luminance > 0.6 ? Colors.black87 : Colors.white;
  }
}

// ─── Tags Section Widget ──────────────────────────────────────────────────────
class _TagsSection extends StatefulWidget {
  final List<String> tags;
  final Color textColor;
  final void Function(String) onAdd;
  final void Function(String) onRemove;

  const _TagsSection({
    required this.tags,
    required this.textColor,
    required this.onAdd,
    required this.onRemove,
  });

  @override
  State<_TagsSection> createState() => _TagsSectionState();
}

class _TagsSectionState extends State<_TagsSection> {
  bool _showInput = false;
  final _controller = TextEditingController();

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  void _submitTag() {
    final tag = _controller.text.trim();
    if (tag.isNotEmpty && !widget.tags.contains(tag)) {
      widget.onAdd(tag);
    }
    _controller.clear();
    setState(() => _showInput = false);
  }

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(Icons.label_outline, size: 18, color: widget.textColor.withOpacity(0.7)),
            const SizedBox(width: 6),
            Text(
              'Tags',
              style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                  color: widget.textColor.withOpacity(0.7)),
            ),
            const Spacer(),
            GestureDetector(
              onTap: () => setState(() => _showInput = true),
              child: Icon(Icons.add_circle_outline,
                  size: 20, color: widget.textColor.withOpacity(0.7)),
            ),
          ],
        ),
        const SizedBox(height: 8),
        Wrap(
          spacing: 8,
          runSpacing: 8,
          children: [
            ...widget.tags.map((tag) => Chip(
                  label: Text(tag,
                      style: TextStyle(
                          fontSize: 12, color: widget.textColor)),
                  backgroundColor:
                      widget.textColor.withOpacity(0.12),
                  side: BorderSide(
                      color: widget.textColor.withOpacity(0.2)),
                  deleteIcon: Icon(Icons.close,
                      size: 14, color: widget.textColor),
                  onDeleted: () => widget.onRemove(tag),
                  materialTapTargetSize: MaterialTapTargetSize.shrinkWrap,
                  padding: const EdgeInsets.symmetric(horizontal: 4),
                )),
            if (_showInput)
              SizedBox(
                width: 120,
                height: 36,
                child: TextField(
                  controller: _controller,
                  autofocus: true,
                  textCapitalization: TextCapitalization.words,
                  style: TextStyle(fontSize: 13, color: widget.textColor),
                  decoration: InputDecoration(
                    hintText: 'Add tag',
                    hintStyle: TextStyle(
                        fontSize: 12,
                        color: widget.textColor.withOpacity(0.4)),
                    isDense: true,
                    contentPadding: const EdgeInsets.symmetric(
                        horizontal: 10, vertical: 8),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(20),
                      borderSide: BorderSide(
                          color: widget.textColor.withOpacity(0.3)),
                    ),
                    enabledBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(20),
                      borderSide: BorderSide(
                          color: widget.textColor.withOpacity(0.3)),
                    ),
                    focusedBorder: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(20),
                      borderSide:
                          BorderSide(color: widget.textColor),
                    ),
                  ),
                  onSubmitted: (_) => _submitTag(),
                  onEditingComplete: _submitTag,
                ),
              ),
          ],
        ),
      ],
    );
  }
}

// ─── Toolbar Chip ─────────────────────────────────────────────────────────────
class _ToolbarChip extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback onTap;
  final bool hasValue;

  const _ToolbarChip({
    required this.icon,
    required this.label,
    required this.color,
    required this.onTap,
    this.hasValue = false,
  });

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding:
            const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: color.withOpacity(hasValue ? 0.2 : 0.1),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
              color: color.withOpacity(hasValue ? 0.6 : 0.25)),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 16, color: color.withOpacity(0.8)),
            const SizedBox(width: 6),
            Text(
              label,
              style: TextStyle(
                  fontSize: 13,
                  color: color,
                  fontWeight: hasValue
                      ? FontWeight.bold
                      : FontWeight.normal),
            ),
          ],
        ),
      ),
    );
  }
}
