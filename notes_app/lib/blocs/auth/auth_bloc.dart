import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'auth_event.dart';
import 'auth_state.dart';
import '../../mock/mock_data.dart';

class AuthBloc extends Bloc<AuthEvent, AuthState> {
  static const _authKey = 'is_logged_in';

  AuthBloc() : super(const AuthState()) {
    on<CheckAuthStatus>(_onCheckAuthStatus);
    on<LoginRequested>(_onLoginRequested);
    on<RegisterRequested>(_onRegisterRequested);
    on<LogoutRequested>(_onLogoutRequested);
  }

  void _onCheckAuthStatus(CheckAuthStatus event, Emitter<AuthState> emit) async {
    final prefs = await SharedPreferences.getInstance();
    final isLoggedIn = prefs.getBool(_authKey) ?? false;
    await Future.delayed(const Duration(seconds: 2)); // Simulate splash screen load
    if (isLoggedIn) {
      emit(state.copyWith(status: AuthStatus.authenticated, user: MockData.currentUser));
    } else {
      emit(state.copyWith(status: AuthStatus.unauthenticated));
    }
  }

  void _onLoginRequested(LoginRequested event, Emitter<AuthState> emit) async {
    emit(state.copyWith(status: AuthStatus.loading));
    await Future.delayed(const Duration(seconds: 1)); // Simulate API call
    if (event.email.isNotEmpty && event.password.isNotEmpty) {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setBool(_authKey, true);
      emit(state.copyWith(status: AuthStatus.authenticated, user: MockData.currentUser));
    } else {
      emit(state.copyWith(status: AuthStatus.error, errorMessage: 'Invalid credentials'));
      emit(state.copyWith(status: AuthStatus.unauthenticated));
    }
  }

  void _onRegisterRequested(RegisterRequested event, Emitter<AuthState> emit) async {
    emit(state.copyWith(status: AuthStatus.loading));
    await Future.delayed(const Duration(seconds: 1));
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_authKey, true);
    emit(state.copyWith(status: AuthStatus.authenticated, user: MockData.currentUser));
  }

  void _onLogoutRequested(LogoutRequested event, Emitter<AuthState> emit) async {
    emit(state.copyWith(status: AuthStatus.loading));
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_authKey, false);
    emit(state.copyWith(status: AuthStatus.unauthenticated, user: null));
  }
}
