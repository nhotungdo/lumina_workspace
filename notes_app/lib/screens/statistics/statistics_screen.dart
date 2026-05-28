import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fl_chart/fl_chart.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../blocs/notes/notes_bloc.dart';
import '../../blocs/notes/notes_state.dart';
import '../../models/models.dart';

class StatisticsScreen extends StatelessWidget {
  const StatisticsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Statistics'),
      ),
      body: BlocBuilder<NotesBloc, NotesState>(
        builder: (context, state) {
          final notes = state.activeNotes;
          final totalNotes = notes.length;
          final favoriteCount = state.favoriteNotes.length;
          final pinnedCount = state.pinnedNotes.length;
          final reminderCount = state.reminderNotes.length;
          final trashCount = state.trashNotes.length;

          // Build per-day chart data for the current week (Mon–Sun)
          final weeklyData = _buildWeeklyData(state.notes);
          final maxY = weeklyData.reduce((a, b) => a > b ? a : b).toDouble();

          return SingleChildScrollView(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Stats grid
                Row(
                  children: [
                    _StatCard(
                      icon: Icons.note_alt_rounded,
                      label: 'Total Notes',
                      value: '$totalNotes',
                      color: Theme.of(context).colorScheme.primary,
                    ).animate().fade().slideY(begin: 0.2),
                    const SizedBox(width: 12),
                    _StatCard(
                      icon: Icons.favorite_rounded,
                      label: 'Favorites',
                      value: '$favoriteCount',
                      color: Colors.pink,
                    ).animate().fade(delay: 80.ms).slideY(begin: 0.2),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    _StatCard(
                      icon: Icons.push_pin_rounded,
                      label: 'Pinned',
                      value: '$pinnedCount',
                      color: Colors.amber.shade700,
                    ).animate().fade(delay: 160.ms).slideY(begin: 0.2),
                    const SizedBox(width: 12),
                    _StatCard(
                      icon: Icons.alarm_rounded,
                      label: 'Reminders',
                      value: '$reminderCount',
                      color: Colors.teal,
                    ).animate().fade(delay: 240.ms).slideY(begin: 0.2),
                  ],
                ),
                const SizedBox(height: 12),
                Row(
                  children: [
                    _StatCard(
                      icon: Icons.delete_outline_rounded,
                      label: 'In Trash',
                      value: '$trashCount',
                      color: Colors.grey,
                    ).animate().fade(delay: 320.ms).slideY(begin: 0.2),
                    const SizedBox(width: 12),
                    _StatCard(
                      icon: Icons.category_rounded,
                      label: 'Categories',
                      value: _uniqueCategoryCount(notes).toString(),
                      color: Colors.deepPurple,
                    ).animate().fade(delay: 400.ms).slideY(begin: 0.2),
                  ],
                ),

                const SizedBox(height: 32),

                // Weekly chart
                Text(
                  'Notes This Week',
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                ).animate().fade(delay: 480.ms),
                const SizedBox(height: 4),
                Text(
                  'Notes created or updated per day',
                  style: Theme.of(context).textTheme.bodySmall,
                ).animate().fade(delay: 500.ms),
                const SizedBox(height: 16),

                Card(
                  elevation: 4,
                  shadowColor: Theme.of(context)
                      .colorScheme
                      .primary
                      .withOpacity(0.2),
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(20)),
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(16, 24, 24, 16),
                    child: SizedBox(
                      height: 220,
                      child: BarChart(
                        BarChartData(
                          alignment: BarChartAlignment.spaceAround,
                          maxY: maxY < 1 ? 5 : maxY + 2,
                          barTouchData: BarTouchData(
                            enabled: true,
                            touchTooltipData: BarTouchTooltipData(
                              tooltipBorderRadius: BorderRadius.circular(12),
                              getTooltipItem: (group, groupIndex,
                                  rod, rodIndex) {
                                return BarTooltipItem(
                                  '${rod.toY.toInt()} notes',
                                  const TextStyle(
                                      color: Colors.white,
                                      fontWeight: FontWeight.bold),
                                );
                              },
                            ),
                          ),
                          titlesData: FlTitlesData(
                            show: true,
                            bottomTitles: AxisTitles(
                              sideTitles: SideTitles(
                                showTitles: true,
                                getTitlesWidget: (value, meta) {
                                  const days = [
                                    'Mon',
                                    'Tue',
                                    'Wed',
                                    'Thu',
                                    'Fri',
                                    'Sat',
                                    'Sun'
                                  ];
                                  final isToday =
                                      value.toInt() == _todayIndex();
                                  return SideTitleWidget(
                                    meta: meta,
                                    space: 8,
                                    child: Text(
                                      days[value.toInt()],
                                      style: TextStyle(
                                        color: isToday
                                            ? Theme.of(context)
                                                .colorScheme
                                                .primary
                                            : Colors.grey,
                                        fontWeight: isToday
                                            ? FontWeight.bold
                                            : FontWeight.normal,
                                        fontSize: 13,
                                      ),
                                    ),
                                  );
                                },
                              ),
                            ),
                            leftTitles: AxisTitles(
                              sideTitles: SideTitles(
                                showTitles: true,
                                reservedSize: 28,
                                getTitlesWidget: (value, meta) {
                                  if (value == 0 ||
                                      value == meta.max) {
                                    return const SizedBox.shrink();
                                  }
                                  return SideTitleWidget(
                                    meta: meta,
                                    space: 4,
                                    child: Text(
                                      value.toInt().toString(),
                                      style: const TextStyle(
                                          color: Colors.grey,
                                          fontSize: 11),
                                    ),
                                  );
                                },
                              ),
                            ),
                            topTitles: const AxisTitles(
                                sideTitles:
                                    SideTitles(showTitles: false)),
                            rightTitles: const AxisTitles(
                                sideTitles:
                                    SideTitles(showTitles: false)),
                          ),
                          borderData: FlBorderData(show: false),
                          gridData: FlGridData(
                            show: true,
                            drawVerticalLine: false,
                            getDrawingHorizontalLine: (value) => FlLine(
                              color: Colors.grey.withOpacity(0.15),
                              strokeWidth: 1,
                            ),
                          ),
                          barGroups: List.generate(7, (index) {
                            final isToday = index == _todayIndex();
                            return BarChartGroupData(
                              x: index,
                              barRods: [
                                BarChartRodData(
                                  toY: weeklyData[index].toDouble(),
                                  width: 18,
                                  borderRadius:
                                      const BorderRadius.vertical(
                                          top: Radius.circular(8)),
                                  gradient: LinearGradient(
                                    begin: Alignment.bottomCenter,
                                    end: Alignment.topCenter,
                                    colors: isToday
                                        ? [
                                            Theme.of(context)
                                                .colorScheme
                                                .primary,
                                            Theme.of(context)
                                                .colorScheme
                                                .secondary,
                                          ]
                                        : [
                                            Theme.of(context)
                                                .colorScheme
                                                .primary
                                                .withOpacity(0.4),
                                            Theme.of(context)
                                                .colorScheme
                                                .primary
                                                .withOpacity(0.7),
                                          ],
                                  ),
                                ),
                              ],
                            );
                          }),
                        ),
                      ),
                    ),
                  ),
                ).animate().fade(delay: 560.ms).slideY(begin: 0.2),

                const SizedBox(height: 24),

                // Category breakdown
                if (notes.isNotEmpty) ...[
                  Text(
                    'By Category',
                    style:
                        Theme.of(context).textTheme.titleLarge?.copyWith(
                              fontWeight: FontWeight.bold,
                            ),
                  ).animate().fade(delay: 600.ms),
                  const SizedBox(height: 12),
                  _buildCategoryBreakdown(context, notes),
                ],
              ],
            ),
          );
        },
      ),
    );
  }

  /// Returns count of notes created/updated each day of the current week [Mon..Sun]
  List<int> _buildWeeklyData(List<Note> allNotes) {
    final now = DateTime.now();
    // Monday of this week
    final weekStart =
        now.subtract(Duration(days: now.weekday - 1));

    return List.generate(7, (dayIndex) {
      final day = DateTime(
          weekStart.year, weekStart.month, weekStart.day + dayIndex);
      return allNotes.where((n) {
        final d = n.updatedAt;
        return d.year == day.year &&
            d.month == day.month &&
            d.day == day.day;
      }).length;
    });
  }

  /// 0 = Monday, 6 = Sunday
  int _todayIndex() {
    return DateTime.now().weekday - 1; // weekday: 1=Mon, 7=Sun
  }

  int _uniqueCategoryCount(List<Note> notes) {
    return notes.map((n) => n.categoryId).toSet().length;
  }

  Widget _buildCategoryBreakdown(
      BuildContext context, List<Note> notes) {
    final categoryMap = <String, int>{};
    for (final note in notes) {
      categoryMap[note.categoryId] =
          (categoryMap[note.categoryId] ?? 0) + 1;
    }
    final total = notes.length;

    return Card(
      shape:
          RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: categoryMap.entries.map((entry) {
            final pct = entry.value / total;
            final color = _categoryColor(entry.key);
            return Padding(
              padding: const EdgeInsets.symmetric(vertical: 6),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment:
                        MainAxisAlignment.spaceBetween,
                    children: [
                      Text(_categoryName(entry.key),
                          style: const TextStyle(
                              fontWeight: FontWeight.w600)),
                      Text('${entry.value} notes',
                          style:
                              const TextStyle(color: Colors.grey)),
                    ],
                  ),
                  const SizedBox(height: 6),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(8),
                    child: LinearProgressIndicator(
                      value: pct,
                      backgroundColor: color.withOpacity(0.15),
                      valueColor:
                          AlwaysStoppedAnimation<Color>(color),
                      minHeight: 8,
                    ),
                  ),
                ],
              ),
            );
          }).toList(),
        ),
      ),
    ).animate().fade(delay: 640.ms).slideY(begin: 0.15);
  }

  Color _categoryColor(String id) {
    switch (id) {
      case 'c1':
        return const Color(0xFF4F46E5);
      case 'c2':
        return const Color(0xFF9333EA);
      case 'c3':
        return const Color(0xFFF59E0B);
      default:
        return Colors.teal;
    }
  }

  String _categoryName(String id) {
    switch (id) {
      case 'c1':
        return 'Work';
      case 'c2':
        return 'Personal';
      case 'c3':
        return 'Ideas';
      default:
        return 'Other';
    }
  }
}

class _StatCard extends StatelessWidget {
  final IconData icon;
  final String label;
  final String value;
  final Color color;

  const _StatCard({
    required this.icon,
    required this.label,
    required this.value,
    required this.color,
  });

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Card(
        elevation: 3,
        shadowColor: color.withOpacity(0.2),
        shape:
            RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.12),
                  shape: BoxShape.circle,
                ),
                child: Icon(icon, size: 28, color: color),
              ),
              const SizedBox(height: 10),
              Text(
                value,
                style: TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                  color: color,
                ),
              ),
              Text(
                label,
                style: const TextStyle(color: Colors.grey, fontSize: 12),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
