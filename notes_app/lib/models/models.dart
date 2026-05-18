import 'package:equatable/equatable.dart';
import 'package:flutter/material.dart';

class User extends Equatable {
  final String id;
  final String name;
  final String email;
  final String avatarUrl;

  const User({required this.id, required this.name, required this.email, required this.avatarUrl});

  @override
  List<Object?> get props => [id, name, email, avatarUrl];
}

class Category extends Equatable {
  final String id;
  final String name;
  final int colorValue;
  final IconData icon;

  const Category({required this.id, required this.name, required this.colorValue, required this.icon});

  @override
  List<Object?> get props => [id, name, colorValue, icon];
}

class Note extends Equatable {
  final String id;
  final String title;
  final String content;
  final DateTime createdAt;
  final DateTime updatedAt;
  final String categoryId;
  final int colorValue;
  final bool isPinned;
  final bool isFavorite;
  final bool isDeleted;
  final List<String> tags;
  final List<String> imageUrls;
  final Reminder? reminder;

  const Note({
    required this.id,
    required this.title,
    required this.content,
    required this.createdAt,
    required this.updatedAt,
    required this.categoryId,
    required this.colorValue,
    this.isPinned = false,
    this.isFavorite = false,
    this.isDeleted = false,
    this.tags = const [],
    this.imageUrls = const [],
    this.reminder,
  });

  Note copyWith({
    String? title,
    String? content,
    DateTime? updatedAt,
    String? categoryId,
    int? colorValue,
    bool? isPinned,
    bool? isFavorite,
    bool? isDeleted,
    List<String>? tags,
    List<String>? imageUrls,
    Reminder? reminder,
  }) {
    return Note(
      id: id,
      title: title ?? this.title,
      content: content ?? this.content,
      createdAt: createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
      categoryId: categoryId ?? this.categoryId,
      colorValue: colorValue ?? this.colorValue,
      isPinned: isPinned ?? this.isPinned,
      isFavorite: isFavorite ?? this.isFavorite,
      isDeleted: isDeleted ?? this.isDeleted,
      tags: tags ?? this.tags,
      imageUrls: imageUrls ?? this.imageUrls,
      reminder: reminder ?? this.reminder,
    );
  }

  @override
  List<Object?> get props => [id, title, content, createdAt, updatedAt, categoryId, colorValue, isPinned, isFavorite, isDeleted, tags, imageUrls, reminder];
}

class Reminder extends Equatable {
  final DateTime dateTime;
  final String repeatMode;

  const Reminder({required this.dateTime, this.repeatMode = 'none'});

  @override
  List<Object?> get props => [dateTime, repeatMode];
}
