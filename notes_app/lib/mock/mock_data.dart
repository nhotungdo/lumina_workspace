import 'package:flutter/material.dart';
import '../models/models.dart';
import '../core/theme/app_colors.dart';

class MockData {
  static final User currentUser = const User(
    id: 'u1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
  );

  static final List<Category> categories = [
    const Category(id: 'c1', name: 'Work', colorValue: 0xFF4F46E5, icon: Icons.work),
    const Category(id: 'c2', name: 'Personal', colorValue: 0xFF9333EA, icon: Icons.person),
    const Category(id: 'c3', name: 'Ideas', colorValue: 0xFFF59E0B, icon: Icons.lightbulb),
  ];

  static final List<Note> notes = [
    Note(
      id: 'n1',
      title: 'Meeting Notes: Q3 Planning',
      content: '1. Review Q2 goals\n2. Discuss new marketing strategy\n3. Assign budget for new tools.',
      createdAt: DateTime.now().subtract(const Duration(days: 1)),
      updatedAt: DateTime.now().subtract(const Duration(days: 1)),
      categoryId: 'c1',
      colorValue: AppColors.noteColors[4].value,
      isPinned: true,
      tags: ['Work', 'Meeting'],
    ),
    Note(
      id: 'n2',
      title: 'Grocery List',
      content: '- Milk\n- Eggs\n- Bread\n- Apples\n- Coffee',
      createdAt: DateTime.now().subtract(const Duration(days: 2)),
      updatedAt: DateTime.now().subtract(const Duration(days: 2)),
      categoryId: 'c2',
      colorValue: AppColors.noteColors[3].value,
      isFavorite: true,
      tags: ['Shopping'],
    ),
    Note(
      id: 'n3',
      title: 'App Idea: Fitness Tracker',
      content: 'A gamified fitness tracker that rewards users with virtual badges for consistency.',
      createdAt: DateTime.now().subtract(const Duration(days: 5)),
      updatedAt: DateTime.now().subtract(const Duration(days: 3)),
      categoryId: 'c3',
      colorValue: AppColors.noteColors[1].value,
      tags: ['Idea', 'App'],
    ),
    Note(
      id: 'n4',
      title: 'Books to Read',
      content: '1. The Lean Startup\n2. Atomic Habits\n3. Thinking, Fast and Slow',
      createdAt: DateTime.now().subtract(const Duration(days: 10)),
      updatedAt: DateTime.now().subtract(const Duration(days: 10)),
      categoryId: 'c2',
      colorValue: AppColors.noteColors[5].value,
      tags: ['Reading'],
    ),
    Note(
      id: 'n5',
      title: 'Trip to Japan',
      content: 'Places to visit:\n- Tokyo\n- Kyoto\n- Osaka\nNeed to book hotels by next week.',
      createdAt: DateTime.now().subtract(const Duration(days: 15)),
      updatedAt: DateTime.now().subtract(const Duration(days: 15)),
      categoryId: 'c2',
      colorValue: AppColors.noteColors[0].value,
      isFavorite: true,
      tags: ['Travel'],
    ),
  ];
}
