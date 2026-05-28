import 'package:equatable/equatable.dart';

abstract class AuthEvent extends Equatable {
  const AuthEvent();

  @override
  List<Object?> get props => [];
}

class CheckAuthStatus extends AuthEvent {}

class LoginRequested extends AuthEvent {
  final String email;
  final String password;
  const LoginRequested(this.email, this.password);
  @override
  List<Object?> get props => [email, password];
}

class RegisterRequested extends AuthEvent {
  final String name;
  final String email;
  final String password;
  const RegisterRequested(this.name, this.email, this.password);
  @override
  List<Object?> get props => [name, email, password];
}

class LogoutRequested extends AuthEvent {}

class ForgotPasswordRequested extends AuthEvent {
  final String email;
  const ForgotPasswordRequested(this.email);
  @override
  List<Object?> get props => [email];
}

class UpdateProfileRequested extends AuthEvent {
  final String name;
  final String email;
  const UpdateProfileRequested(this.name, this.email);
  @override
  List<Object?> get props => [name, email];
}

class ChangePasswordRequested extends AuthEvent {
  final String currentPassword;
  final String newPassword;
  const ChangePasswordRequested(this.currentPassword, this.newPassword);
  @override
  List<Object?> get props => [currentPassword, newPassword];
}
