import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'theme_event.dart';
import 'theme_state.dart';

class ThemeBloc extends Bloc<ThemeEvent, ThemeState> {
  static const _themePrefKey = 'theme_pref';

  ThemeBloc() : super(const ThemeState(themeMode: ThemeMode.system)) {
    on<ThemeChanged>(_onThemeChanged);
    _loadTheme();
  }

  void _onThemeChanged(ThemeChanged event, Emitter<ThemeState> emit) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_themePrefKey, event.themeMode.toString());
    emit(ThemeState(themeMode: event.themeMode));
  }

  void _loadTheme() async {
    final prefs = await SharedPreferences.getInstance();
    final themeStr = prefs.getString(_themePrefKey);
    ThemeMode themeMode = ThemeMode.system;
    if (themeStr == ThemeMode.light.toString()) {
      themeMode = ThemeMode.light;
    } else if (themeStr == ThemeMode.dark.toString()) {
      themeMode = ThemeMode.dark;
    }
    add(ThemeChanged(themeMode));
  }
}
