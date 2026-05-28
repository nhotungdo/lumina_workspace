import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'auth_event.dart';
import 'auth_state.dart';
import '../../mock/mock_data.dart';
import '../../models/models.dart';

class AuthBloc extends Bloc<AuthEvent, AuthState> {
  static const _authKey = 'is_logged_in';

  AuthBloc() : super(const AuthState()) {
    on<CheckAuthStatus>(_onCheckAuthStatus);
    on<LoginRequested>(_onLoginRequested);
    on<RegisterRequested>(_onRegisterRequested);
    on<LogoutRequested>(_onLogoutRequested);
    on<ForgotPasswordRequested>(_onForgotPasswordRequested);
    on<UpdateProfileRequested>(_onUpdateProfileRequested);
    on<ChangePasswordRequested>(_onChangePasswordRequested);
  }

  void _onCheckAuthStatus(
      CheckAuthStatus event, Emitter<AuthState> emit) async {
    final prefs = await SharedPreferences.getInstance();
    final isLoggedIn = prefs.getBool(_authKey) ?? false;
    await Future.delayed(const Duration(seconds: 2));
    if (isLoggedIn) {
      emit(state.copyWith(
          status: AuthStatus.authenticated, user: MockData.currentUser));
    } else {
      emit(state.copyWith(status: AuthStatus.unauthenticated));
    }
  }

  void _onLoginRequested(
      LoginRequested event, Emitter<AuthState> emit) async {
    emit(state.copyWith(status: AuthStatus.loading));
    await Future.delayed(const Duration(seconds: 1));
    if (event.email.isNotEmpty && event.password.isNotEmpty) {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setBool(_authKey, true);
      emit(state.copyWith(
          status: AuthStatus.authenticated, user: MockData.currentUser));
    } else {
      emit(state.copyWith(
          status: AuthStatus.error, errorMessage: 'Invalid credentials'));
      emit(state.copyWith(status: AuthStatus.unauthenticated));
    }
  }

  void _onRegisterRequested(
      RegisterRequested event, Emitter<AuthState> emit) async {
    emit(state.copyWith(status: AuthStatus.loading));
    await Future.delayed(const Duration(seconds: 1));
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_authKey, true);
    // Create user from registration data
    final newUser = User(
      id: 'u_${DateTime.now().millisecondsSinceEpoch}',
      name: event.name,
      email: event.email,
      avatarUrl: 'https://i.pravatar.cc/150?u=${event.email}',
    );
    emit(state.copyWith(status: AuthStatus.authenticated, user: newUser));
  }

  void _onLogoutRequested(
      LogoutRequested event, Emitter<AuthState> emit) async {
    emit(state.copyWith(status: AuthStatus.loading));
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_authKey, false);
    emit(state.copyWith(status: AuthStatus.unauthenticated, user: null));
  }

  void _onForgotPasswordRequested(
      ForgotPasswordRequested event, Emitter<AuthState> emit) async {
    emit(state.copyWith(status: AuthStatus.loading));
    await Future.delayed(const Duration(seconds: 1));
    // In a real app: FirebaseAuth.instance.sendPasswordResetEmail(email: event.email)
    if (event.email.isNotEmpty) {
      emit(state.copyWith(
        status: AuthStatus.passwordResetSent,
        successMessage: 'Password reset email sent to ${event.email}',
      ));
    } else {
      emit(state.copyWith(
        status: AuthStatus.error,
        errorMessage: 'Please enter your email address',
      ));
    }
  }

  void _onUpdateProfileRequested(
      UpdateProfileRequested event, Emitter<AuthState> emit) async {
    emit(state.copyWith(status: AuthStatus.loading));
    await Future.delayed(const Duration(milliseconds: 800));
    // Update user in state (in real app: Firestore update + SharedPreferences)
    if (state.user != null) {
      final updatedUser = User(
        id: state.user!.id,
        name: event.name,
        email: event.email,
        avatarUrl: state.user!.avatarUrl,
      );
      emit(state.copyWith(
        status: AuthStatus.authenticated,
        user: updatedUser,
        successMessage: 'Profile updated successfully',
      ));
    }
  }

  void _onChangePasswordRequested(
      ChangePasswordRequested event, Emitter<AuthState> emit) async {
    emit(state.copyWith(status: AuthStatus.loading));
    await Future.delayed(const Duration(milliseconds: 800));
    // In real app: re-authenticate then update password
    if (event.currentPassword.isNotEmpty && event.newPassword.length >= 6) {
      emit(state.copyWith(
        status: AuthStatus.authenticated,
        successMessage: 'Password changed successfully',
      ));
    } else {
      emit(state.copyWith(
        status: AuthStatus.error,
        errorMessage: event.newPassword.length < 6
            ? 'New password must be at least 6 characters'
            : 'Current password cannot be empty',
      ));
    }
  }
}
