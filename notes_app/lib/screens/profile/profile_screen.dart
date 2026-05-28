import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../blocs/auth/auth_bloc.dart';
import '../../blocs/auth/auth_event.dart';
import '../../blocs/auth/auth_state.dart';
import '../../blocs/notes/notes_bloc.dart';
import '../../blocs/notes/notes_state.dart';
import '../../widgets/custom_button.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: BlocListener<AuthBloc, AuthState>(
        listener: (context, state) {
          if (state.status == AuthStatus.unauthenticated) {
            context.go('/login');
          }
          if (state.successMessage != null &&
              state.status == AuthStatus.authenticated) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(state.successMessage!),
                backgroundColor: Colors.green,
                behavior: SnackBarBehavior.floating,
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12)),
              ),
            );
          }
        },
        child: BlocBuilder<AuthBloc, AuthState>(
          builder: (context, authState) {
            final user = authState.user;
            if (user == null) return const SizedBox.shrink();

            return CustomScrollView(
              slivers: [
                // Gradient header
                SliverAppBar(
                  expandedHeight: 220,
                  pinned: true,
                  flexibleSpace: FlexibleSpaceBar(
                    background: Container(
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
                      child: SafeArea(
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Stack(
                              children: [
                                CircleAvatar(
                                  radius: 52,
                                  backgroundColor: Colors.white24,
                                  backgroundImage:
                                      NetworkImage(user.avatarUrl),
                                  onBackgroundImageError: (_, __) {},
                                ).animate().scale(delay: 100.ms),
                                Positioned(
                                  bottom: 0,
                                  right: 0,
                                  child: GestureDetector(
                                    onTap: () =>
                                        _showAvatarOptions(context),
                                    child: Container(
                                      width: 34,
                                      height: 34,
                                      decoration: BoxDecoration(
                                        color: Colors.white,
                                        shape: BoxShape.circle,
                                        boxShadow: [
                                          BoxShadow(
                                            color:
                                                Colors.black.withOpacity(0.15),
                                            blurRadius: 8,
                                          )
                                        ],
                                      ),
                                      child: Icon(
                                        Icons.camera_alt_rounded,
                                        size: 18,
                                        color: Theme.of(context)
                                            .colorScheme
                                            .primary,
                                      ),
                                    ),
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 12),
                            Text(
                              user.name,
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 22,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              user.email,
                              style: const TextStyle(
                                color: Colors.white70,
                                fontSize: 14,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ),

                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.all(20),
                    child: Column(
                      children: [
                        // Stats row from NotesBloc
                        BlocBuilder<NotesBloc, NotesState>(
                          builder: (context, notesState) {
                            return Row(
                              children: [
                                _QuickStat(
                                  label: 'Notes',
                                  value:
                                      '${notesState.activeNotes.length}',
                                  icon: Icons.note_alt_rounded,
                                  color: Theme.of(context).colorScheme.primary,
                                ),
                                _QuickStat(
                                  label: 'Favorites',
                                  value:
                                      '${notesState.favoriteNotes.length}',
                                  icon: Icons.favorite_rounded,
                                  color: Colors.pink,
                                ),
                                _QuickStat(
                                  label: 'Reminders',
                                  value:
                                      '${notesState.reminderNotes.length}',
                                  icon: Icons.alarm_rounded,
                                  color: Colors.teal,
                                ),
                              ],
                            );
                          },
                        ),

                        const SizedBox(height: 24),

                        // Account section
                        _SectionCard(
                          title: 'Account',
                          children: [
                            _ProfileTile(
                              icon: Icons.person_outline_rounded,
                              title: 'Edit Profile',
                              subtitle: 'Update your name and email',
                              onTap: () =>
                                  _showEditProfileDialog(context, user.name, user.email),
                            ),
                            const Divider(height: 1, indent: 56),
                            _ProfileTile(
                              icon: Icons.lock_outline_rounded,
                              title: 'Change Password',
                              subtitle: 'Update your password',
                              onTap: () =>
                                  _showChangePasswordDialog(context),
                            ),
                          ],
                        ).animate().fade(delay: 100.ms).slideY(begin: 0.1),

                        const SizedBox(height: 16),

                        // App section
                        _SectionCard(
                          title: 'App',
                          children: [
                            _ProfileTile(
                              icon: Icons.bar_chart_rounded,
                              title: 'Statistics',
                              subtitle: 'View your note activity',
                              onTap: () => context.push('/statistics'),
                            ),
                            const Divider(height: 1, indent: 56),
                            _ProfileTile(
                              icon: Icons.settings_outlined,
                              title: 'Settings',
                              subtitle: 'Theme, notifications and more',
                              onTap: () => context.push('/settings'),
                            ),
                            const Divider(height: 1, indent: 56),
                            _ProfileTile(
                              icon: Icons.delete_outline_rounded,
                              title: 'Trash',
                              subtitle: 'View deleted notes',
                              onTap: () => context.push('/trash'),
                            ),
                          ],
                        ).animate().fade(delay: 200.ms).slideY(begin: 0.1),

                        const SizedBox(height: 32),

                        // Logout button
                        CustomButton(
                          text: 'Sign Out',
                          backgroundColor: Colors.red.shade400,
                          onPressed: () => _confirmLogout(context),
                        ).animate().fade(delay: 300.ms),

                        const SizedBox(height: 24),
                      ],
                    ),
                  ),
                ),
              ],
            );
          },
        ),
      ),
    );
  }

  void _showAvatarOptions(BuildContext context) {
    showModalBottomSheet(
      context: context,
      shape: const RoundedRectangleBorder(
          borderRadius: BorderRadius.vertical(top: Radius.circular(24))),
      builder: (ctx) => Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Change Avatar',
                style:
                    TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 16),
            ListTile(
              leading: const Icon(Icons.camera_alt_rounded),
              title: const Text('Take Photo'),
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12)),
              onTap: () {
                Navigator.pop(ctx);
                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
                  content: Text(
                      'Camera picker — integrate image_picker in production'),
                  behavior: SnackBarBehavior.floating,
                ));
              },
            ),
            ListTile(
              leading: const Icon(Icons.photo_library_rounded),
              title: const Text('Choose from Gallery'),
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12)),
              onTap: () {
                Navigator.pop(ctx);
                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
                  content: Text(
                      'Gallery picker — integrate image_picker in production'),
                  behavior: SnackBarBehavior.floating,
                ));
              },
            ),
          ],
        ),
      ),
    );
  }

  void _showEditProfileDialog(
      BuildContext context, String currentName, String currentEmail) {
    final nameCtrl = TextEditingController(text: currentName);
    final emailCtrl = TextEditingController(text: currentEmail);

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape:
            RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Text('Edit Profile'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(
              controller: nameCtrl,
              decoration: InputDecoration(
                labelText: 'Full Name',
                prefixIcon: const Icon(Icons.person_outline),
                border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12)),
              ),
            ),
            const SizedBox(height: 16),
            TextField(
              controller: emailCtrl,
              keyboardType: TextInputType.emailAddress,
              decoration: InputDecoration(
                labelText: 'Email',
                prefixIcon: const Icon(Icons.email_outlined),
                border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12)),
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              if (nameCtrl.text.trim().isNotEmpty &&
                  emailCtrl.text.trim().isNotEmpty) {
                context.read<AuthBloc>().add(UpdateProfileRequested(
                    nameCtrl.text.trim(), emailCtrl.text.trim()));
                Navigator.of(ctx).pop();
              }
            },
            child: const Text('Save'),
          ),
        ],
      ),
    );
  }

  void _showChangePasswordDialog(BuildContext context) {
    final currentPwCtrl = TextEditingController();
    final newPwCtrl = TextEditingController();
    final confirmPwCtrl = TextEditingController();

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape:
            RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Text('Change Password'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            _PasswordField(
                controller: currentPwCtrl, label: 'Current Password'),
            const SizedBox(height: 16),
            _PasswordField(controller: newPwCtrl, label: 'New Password'),
            const SizedBox(height: 16),
            _PasswordField(
                controller: confirmPwCtrl, label: 'Confirm New Password'),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            onPressed: () {
              if (newPwCtrl.text != confirmPwCtrl.text) {
                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(
                  content: Text('Passwords do not match'),
                  backgroundColor: Colors.red,
                  behavior: SnackBarBehavior.floating,
                ));
                return;
              }
              context.read<AuthBloc>().add(ChangePasswordRequested(
                  currentPwCtrl.text, newPwCtrl.text));
              Navigator.of(ctx).pop();
            },
            child: const Text('Change'),
          ),
        ],
      ),
    );
  }

  void _confirmLogout(BuildContext context) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape:
            RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Text('Sign Out?'),
        content: const Text('Are you sure you want to sign out?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(),
            child: const Text('Cancel'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
                backgroundColor: Colors.red.shade400),
            onPressed: () {
              context.read<AuthBloc>().add(LogoutRequested());
              Navigator.of(ctx).pop();
            },
            child: const Text('Sign Out',
                style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
    );
  }
}

// ─── Helper Widgets ────────────────────────────────────────────────────────────
class _QuickStat extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;
  final Color color;

  const _QuickStat(
      {required this.label,
      required this.value,
      required this.icon,
      required this.color});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Card(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        elevation: 2,
        child: Padding(
          padding: const EdgeInsets.symmetric(vertical: 16),
          child: Column(
            children: [
              Icon(icon, color: color, size: 24),
              const SizedBox(height: 6),
              Text(value,
                  style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                      color: color)),
              Text(label,
                  style:
                      const TextStyle(fontSize: 11, color: Colors.grey)),
            ],
          ),
        ),
      ),
    );
  }
}

class _SectionCard extends StatelessWidget {
  final String title;
  final List<Widget> children;

  const _SectionCard({required this.title, required this.children});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.only(left: 4, bottom: 8),
          child: Text(title.toUpperCase(),
              style: TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                  color: Colors.grey.shade500,
                  letterSpacing: 1.2)),
        ),
        Card(
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
          elevation: 2,
          child: Column(children: children),
        ),
      ],
    );
  }
}

class _ProfileTile extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;
  final VoidCallback onTap;

  const _ProfileTile(
      {required this.icon,
      required this.title,
      required this.subtitle,
      required this.onTap});

  @override
  Widget build(BuildContext context) {
    return ListTile(
      leading: Container(
        width: 40,
        height: 40,
        decoration: BoxDecoration(
          color: Theme.of(context).colorScheme.primary.withOpacity(0.1),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Icon(icon,
            color: Theme.of(context).colorScheme.primary, size: 20),
      ),
      title:
          Text(title, style: const TextStyle(fontWeight: FontWeight.w600)),
      subtitle: Text(subtitle,
          style: const TextStyle(fontSize: 12, color: Colors.grey)),
      trailing: Icon(Icons.chevron_right,
          color: Colors.grey.shade400),
      shape:
          RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      onTap: onTap,
    );
  }
}

class _PasswordField extends StatefulWidget {
  final TextEditingController controller;
  final String label;

  const _PasswordField({required this.controller, required this.label});

  @override
  State<_PasswordField> createState() => _PasswordFieldState();
}

class _PasswordFieldState extends State<_PasswordField> {
  bool _obscure = true;

  @override
  Widget build(BuildContext context) {
    return TextField(
      controller: widget.controller,
      obscureText: _obscure,
      decoration: InputDecoration(
        labelText: widget.label,
        prefixIcon: const Icon(Icons.lock_outline),
        suffixIcon: IconButton(
          icon: Icon(_obscure ? Icons.visibility_off : Icons.visibility),
          onPressed: () => setState(() => _obscure = !_obscure),
        ),
        border:
            OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
      ),
    );
  }
}
