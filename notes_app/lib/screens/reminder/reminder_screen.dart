import 'package:flutter/material.dart';
import '../../widgets/bottom_nav_bar.dart';
import '../../widgets/empty_widget.dart';

class ReminderScreen extends StatelessWidget {
  const ReminderScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Reminders'),
      ),
      body: const EmptyWidget(
        icon: Icons.notifications_active,
        title: 'No Reminders',
        subtitle: 'You have not set any reminders yet.',
      ),
      bottomNavigationBar: const BottomNavBar(currentIndex: 2),
    );
  }
}
