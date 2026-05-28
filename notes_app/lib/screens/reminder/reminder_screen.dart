import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../blocs/notes/notes_bloc.dart';
import '../../blocs/notes/notes_state.dart';
import '../../models/models.dart';
import '../../widgets/bottom_nav_bar.dart';
import '../../widgets/empty_widget.dart';

class ReminderScreen extends StatelessWidget {
  const ReminderScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Reminders'),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications_active_outlined),
            tooltip: 'Upcoming reminders',
            onPressed: () {},
          ),
        ],
      ),
      body: BlocBuilder<NotesBloc, NotesState>(
        builder: (context, state) {
          if (state.status == NotesStatus.loading) {
            return const Center(child: CircularProgressIndicator());
          }

          final reminderNotes = List<Note>.from(state.reminderNotes)
            ..sort((a, b) =>
                a.reminder!.dateTime.compareTo(b.reminder!.dateTime));

          if (reminderNotes.isEmpty) {
            return const EmptyWidget(
              icon: Icons.alarm_off_rounded,
              title: 'No Reminders Yet',
              subtitle:
                  'Add a reminder to a note using the alarm icon when creating or editing a note.',
            );
          }

          // Split into upcoming and past
          final now = DateTime.now();
          final upcoming = reminderNotes
              .where((n) => n.reminder!.dateTime.isAfter(now))
              .toList();
          final past = reminderNotes
              .where((n) => !n.reminder!.dateTime.isAfter(now))
              .toList();

          return ListView(
            padding: const EdgeInsets.all(12),
            children: [
              if (upcoming.isNotEmpty) ...[
                _SectionHeader(
                    icon: Icons.upcoming_rounded,
                    title: 'Upcoming',
                    color: Theme.of(context).colorScheme.primary),
                ...upcoming.asMap().entries.map((entry) =>
                    _ReminderCard(note: entry.value)
                        .animate()
                        .fade(delay: (entry.key * 60).ms)
                        .slideX(begin: 0.1)),
              ],
              if (past.isNotEmpty) ...[
                const SizedBox(height: 16),
                _SectionHeader(
                    icon: Icons.history_rounded,
                    title: 'Past',
                    color: Colors.grey),
                ...past.asMap().entries.map((entry) =>
                    _ReminderCard(note: entry.value, isPast: true)
                        .animate()
                        .fade(delay: (entry.key * 60).ms)
                        .slideX(begin: 0.1)),
              ],
            ],
          );
        },
      ),
      bottomNavigationBar: const BottomNavBar(currentIndex: 2),
    );
  }
}

class _SectionHeader extends StatelessWidget {
  final IconData icon;
  final String title;
  final Color color;

  const _SectionHeader(
      {required this.icon, required this.title, required this.color});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 4),
      child: Row(
        children: [
          Icon(icon, size: 18, color: color),
          const SizedBox(width: 6),
          Text(
            title.toUpperCase(),
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              color: color,
              letterSpacing: 1.2,
            ),
          ),
        ],
      ),
    );
  }
}

class _ReminderCard extends StatelessWidget {
  final Note note;
  final bool isPast;

  const _ReminderCard({required this.note, this.isPast = false});

  @override
  Widget build(BuildContext context) {
    final reminder = note.reminder!;
    final now = DateTime.now();
    final diff = reminder.dateTime.difference(now);

    String timeLabel;
    if (isPast) {
      timeLabel = 'Overdue';
    } else if (diff.inMinutes < 60) {
      timeLabel = 'In ${diff.inMinutes} min';
    } else if (diff.inHours < 24) {
      timeLabel = 'In ${diff.inHours}h ${diff.inMinutes % 60}m';
    } else {
      timeLabel = 'In ${diff.inDays} days';
    }

    return Card(
      margin: const EdgeInsets.symmetric(vertical: 6, horizontal: 4),
      elevation: isPast ? 0 : 3,
      shadowColor:
          Color(note.colorValue).withOpacity(0.3),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: BorderSide(
          color: isPast
              ? Colors.grey.shade200
              : Color(note.colorValue).withOpacity(0.5),
          width: 1.5,
        ),
      ),
      child: InkWell(
        onTap: () => context.push('/note-detail', extra: note),
        borderRadius: BorderRadius.circular(16),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Row(
            children: [
              // Color indicator
              Container(
                width: 4,
                height: 60,
                decoration: BoxDecoration(
                  color:
                      isPast ? Colors.grey : Color(note.colorValue),
                  borderRadius: BorderRadius.circular(4),
                ),
              ),
              const SizedBox(width: 16),
              // Content
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      note.title.isEmpty ? 'Untitled' : note.title,
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: isPast ? Colors.grey : null,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        Icon(
                          Icons.alarm,
                          size: 14,
                          color: isPast
                              ? Colors.grey
                              : Theme.of(context).colorScheme.primary,
                        ),
                        const SizedBox(width: 4),
                        Text(
                          DateFormat('MMM dd, yyyy · hh:mm a')
                              .format(reminder.dateTime),
                          style: TextStyle(
                            fontSize: 13,
                            color: isPast ? Colors.grey : Colors.black54,
                          ),
                        ),
                      ],
                    ),
                    if (reminder.repeatMode != 'none') ...[
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          Icon(Icons.repeat,
                              size: 14, color: Colors.grey.shade500),
                          const SizedBox(width: 4),
                          Text(
                            _formatRepeatMode(reminder.repeatMode),
                            style: TextStyle(
                                fontSize: 12,
                                color: Colors.grey.shade500),
                          ),
                        ],
                      ),
                    ],
                  ],
                ),
              ),
              // Time badge
              Container(
                padding: const EdgeInsets.symmetric(
                    horizontal: 10, vertical: 6),
                decoration: BoxDecoration(
                  color: isPast
                      ? Colors.grey.shade100
                      : Theme.of(context)
                          .colorScheme
                          .primary
                          .withOpacity(0.1),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: Text(
                  timeLabel,
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.bold,
                    color: isPast
                        ? Colors.grey
                        : Theme.of(context).colorScheme.primary,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  String _formatRepeatMode(String mode) {
    switch (mode) {
      case 'daily':
        return 'Repeats daily';
      case 'weekly':
        return 'Repeats weekly';
      case 'monthly':
        return 'Repeats monthly';
      default:
        return 'No repeat';
    }
  }
}
