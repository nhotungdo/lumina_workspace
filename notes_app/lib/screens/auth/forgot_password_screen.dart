import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../blocs/auth/auth_bloc.dart';
import '../../blocs/auth/auth_event.dart';
import '../../blocs/auth/auth_state.dart';
import '../../widgets/custom_button.dart';
import '../../widgets/custom_textfield.dart';

class ForgotPasswordScreen extends StatefulWidget {
  const ForgotPasswordScreen({super.key});

  @override
  State<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends State<ForgotPasswordScreen> {
  final _emailController = TextEditingController();
  bool _emailSent = false;

  @override
  void dispose() {
    _emailController.dispose();
    super.dispose();
  }

  void _sendReset() {
    context
        .read<AuthBloc>()
        .add(ForgotPasswordRequested(_emailController.text.trim()));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: BlocConsumer<AuthBloc, AuthState>(
        listener: (context, state) {
          if (state.status == AuthStatus.passwordResetSent) {
            setState(() => _emailSent = true);
          } else if (state.status == AuthStatus.error) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(state.errorMessage ?? 'Something went wrong'),
                backgroundColor: Colors.red,
                behavior: SnackBarBehavior.floating,
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12)),
              ),
            );
          }
        },
        builder: (context, state) {
          return Container(
            height: MediaQuery.of(context).size.height,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  Theme.of(context).colorScheme.primary.withOpacity(0.08),
                  Theme.of(context).colorScheme.secondary.withOpacity(0.08),
                ],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
            ),
            child: SafeArea(
              child: SingleChildScrollView(
                padding: const EdgeInsets.all(24),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Back button
                    IconButton(
                      onPressed: () => context.pop(),
                      icon: const Icon(Icons.arrow_back_rounded),
                      style: IconButton.styleFrom(
                        backgroundColor: Colors.white,
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(12)),
                      ),
                    ),
                    const SizedBox(height: 32),

                    // Illustration
                    Center(
                      child: Container(
                        width: 100,
                        height: 100,
                        decoration: BoxDecoration(
                          color: Theme.of(context)
                              .colorScheme
                              .primary
                              .withOpacity(0.12),
                          shape: BoxShape.circle,
                        ),
                        child: Icon(
                          _emailSent
                              ? Icons.mark_email_read_rounded
                              : Icons.lock_reset_rounded,
                          size: 52,
                          color: Theme.of(context).colorScheme.primary,
                        ),
                      ),
                    ).animate().fade().scale(),
                    const SizedBox(height: 32),

                    Text(
                      _emailSent ? 'Check Your Email' : 'Forgot Password?',
                      style: Theme.of(context)
                          .textTheme
                          .displaySmall
                          ?.copyWith(fontWeight: FontWeight.bold),
                    ).animate().fade(delay: 100.ms).slideY(begin: -0.1),

                    const SizedBox(height: 12),

                    Text(
                      _emailSent
                          ? 'We\'ve sent a password reset link to ${_emailController.text}. '
                              'Please check your inbox and follow the instructions.'
                          : 'No worries! Enter your email address and we\'ll send you a link to reset your password.',
                      style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                            color: Colors.grey.shade600,
                            height: 1.5,
                          ),
                    ).animate().fade(delay: 200.ms),

                    const SizedBox(height: 40),

                    if (!_emailSent) ...[
                      Card(
                        elevation: 6,
                        shadowColor: Theme.of(context)
                            .colorScheme
                            .primary
                            .withOpacity(0.1),
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(24)),
                        child: Padding(
                          padding: const EdgeInsets.all(24),
                          child: Column(
                            children: [
                              CustomTextField(
                                hintText: 'Email Address',
                                controller: _emailController,
                                prefixIcon: Icons.email_outlined,
                                keyboardType: TextInputType.emailAddress,
                              ),
                              const SizedBox(height: 24),
                              CustomButton(
                                text: 'Send Reset Link',
                                isLoading:
                                    state.status == AuthStatus.loading,
                                onPressed: _sendReset,
                              ),
                            ],
                          ),
                        ),
                      ).animate().fade(delay: 300.ms).slideY(begin: 0.2),
                    ] else ...[
                      // Success state
                      Card(
                        elevation: 6,
                        shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(24)),
                        child: Padding(
                          padding: const EdgeInsets.all(24),
                          child: Column(
                            children: [
                              CustomButton(
                                text: 'Back to Login',
                                onPressed: () => context.go('/login'),
                              ),
                              const SizedBox(height: 16),
                              TextButton(
                                onPressed: () {
                                  setState(() => _emailSent = false);
                                },
                                child: const Text('Resend Email'),
                              ),
                            ],
                          ),
                        ),
                      ).animate().fade(delay: 200.ms).scale(begin: const Offset(0.9, 0.9)),
                    ],
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }
}
