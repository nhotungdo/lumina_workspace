import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';

class SplashScreen extends StatelessWidget {
  const SplashScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        width: double.infinity,
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [
              Theme.of(context).colorScheme.primary,
              Theme.of(context).colorScheme.secondary,
            ],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(
              Icons.note_alt,
              size: 100,
              color: Colors.white,
            ).animate().fade(duration: 800.ms).scale(delay: 400.ms),
            const SizedBox(height: 24),
            Text(
              'Notes App',
              style: Theme.of(context).textTheme.displayMedium?.copyWith(color: Colors.white),
            ).animate().fade(delay: 800.ms).slideY(begin: 0.5),
            const SizedBox(height: 48),
            const CircularProgressIndicator(color: Colors.white).animate().fade(delay: 1200.ms),
          ],
        ),
      ),
    );
  }
}
