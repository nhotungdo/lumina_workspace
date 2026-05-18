import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';

class StatisticsScreen extends StatelessWidget {
  const StatisticsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Statistics'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Expanded(
                  child: Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        children: [
                          Icon(Icons.note_alt, size: 40, color: Theme.of(context).colorScheme.primary),
                          const SizedBox(height: 8),
                          const Text('Total Notes', style: TextStyle(color: Colors.grey)),
                          const Text('42', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
                        ],
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16.0),
                      child: Column(
                        children: [
                          Icon(Icons.check_circle, size: 40, color: Colors.green),
                          const SizedBox(height: 8),
                          const Text('Completed Tasks', style: TextStyle(color: Colors.grey)),
                          const Text('18', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold)),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 32),
            Text('Productivity Chart', style: Theme.of(context).textTheme.titleLarge),
            const SizedBox(height: 16),
            SizedBox(
              height: 250,
              child: Card(
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: BarChart(
                    BarChartData(
                      alignment: BarChartAlignment.spaceAround,
                      maxY: 20,
                      barTouchData: BarTouchData(enabled: false),
                      titlesData: FlTitlesData(
                        show: true,
                        bottomTitles: AxisTitles(
                          sideTitles: SideTitles(
                            showTitles: true,
                            getTitlesWidget: (value, meta) {
                              const style = TextStyle(color: Colors.grey, fontWeight: FontWeight.bold, fontSize: 14);
                              String text;
                              switch (value.toInt()) {
                                case 0: text = 'Mon'; break;
                                case 1: text = 'Tue'; break;
                                case 2: text = 'Wed'; break;
                                case 3: text = 'Thu'; break;
                                case 4: text = 'Fri'; break;
                                case 5: text = 'Sat'; break;
                                case 6: text = 'Sun'; break;
                                default: text = ''; break;
                              }
                              return SideTitleWidget(meta: meta, space: 16, child: Text(text, style: style));
                            },
                          ),
                        ),
                        leftTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                        topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                        rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
                      ),
                      borderData: FlBorderData(show: false),
                      barGroups: [
                        BarChartGroupData(x: 0, barRods: [BarChartRodData(toY: 8, color: Theme.of(context).colorScheme.primary)]),
                        BarChartGroupData(x: 1, barRods: [BarChartRodData(toY: 10, color: Theme.of(context).colorScheme.primary)]),
                        BarChartGroupData(x: 2, barRods: [BarChartRodData(toY: 14, color: Theme.of(context).colorScheme.primary)]),
                        BarChartGroupData(x: 3, barRods: [BarChartRodData(toY: 15, color: Theme.of(context).colorScheme.primary)]),
                        BarChartGroupData(x: 4, barRods: [BarChartRodData(toY: 13, color: Theme.of(context).colorScheme.primary)]),
                        BarChartGroupData(x: 5, barRods: [BarChartRodData(toY: 10, color: Theme.of(context).colorScheme.primary)]),
                        BarChartGroupData(x: 6, barRods: [BarChartRodData(toY: 16, color: Theme.of(context).colorScheme.primary)]),
                      ],
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
