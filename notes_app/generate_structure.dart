import 'dart:io';

void main() {
  final Map<String, List<String>> structure = {
    'assets/images/onboarding': [],
    'assets/images/avatars': [],
    'assets/images/backgrounds': [],
    'assets/images/icons': [],
    'assets/images/logo': [],
    'assets/animations': [],
    'assets/fonts': [],
    'assets/sounds': [],

    'lib/core/constants': [
      'app_colors.dart',
      'app_strings.dart',
      'app_sizes.dart',
      'app_assets.dart',
      'app_icons.dart'
    ],
    'lib/core/themes': [
      'light_theme.dart',
      'dark_theme.dart',
      'app_theme.dart'
    ],
    'lib/core/routes': [
      'app_routes.dart',
      'route_names.dart'
    ],
    'lib/core/utils': [
      'validators.dart',
      'date_formatter.dart',
      'responsive.dart',
      'extensions.dart',
      'app_helpers.dart'
    ],
    'lib/core/services': [
      'notification_service.dart',
      'storage_service.dart',
      'theme_service.dart',
      'connectivity_service.dart'
    ],
    'lib/core/network': [
      'api_client.dart',
      'dio_provider.dart',
      'api_endpoints.dart'
    ],
    'lib/core/errors': [
      'exceptions.dart',
      'failures.dart'
    ],

    'lib/data/models': [
      'user_model.dart',
      'note_model.dart',
      'category_model.dart',
      'reminder_model.dart',
      'tag_model.dart'
    ],
    'lib/data/datasources/local': [
      'sqlite_helper.dart',
      'hive_service.dart',
      'shared_pref_service.dart'
    ],
    'lib/data/datasources/remote': [
      'auth_remote_datasource.dart',
      'notes_remote_datasource.dart',
      'category_remote_datasource.dart'
    ],
    'lib/data/repositories': [
      'auth_repository_impl.dart',
      'note_repository_impl.dart',
      'category_repository_impl.dart',
      'reminder_repository_impl.dart'
    ],

    'lib/domain/entities': [
      'user_entity.dart',
      'note_entity.dart',
      'category_entity.dart',
      'reminder_entity.dart'
    ],
    'lib/domain/repositories': [
      'auth_repository.dart',
      'note_repository.dart',
      'category_repository.dart'
    ],
    'lib/domain/usecases/auth': [
      'login_usecase.dart',
      'register_usecase.dart',
      'logout_usecase.dart'
    ],
    'lib/domain/usecases/notes': [
      'create_note_usecase.dart',
      'update_note_usecase.dart',
      'delete_note_usecase.dart',
      'get_notes_usecase.dart'
    ],
    'lib/domain/usecases/categories': [
      'add_category_usecase.dart',
      'get_categories_usecase.dart'
    ],

    'lib/presentation/providers': [
      'auth_provider.dart',
      'note_provider.dart',
      'theme_provider.dart',
      'reminder_provider.dart',
      'category_provider.dart'
    ],
    'lib/presentation/widgets/common': [
      'custom_button.dart',
      'custom_textfield.dart',
      'custom_appbar.dart',
      'loading_widget.dart',
      'empty_widget.dart',
      'error_widget.dart',
      'app_dialog.dart'
    ],
    'lib/presentation/widgets/notes': [
      'note_card.dart',
      'note_grid.dart',
      'note_list.dart',
      'note_editor.dart',
      'checklist_widget.dart'
    ],
    'lib/presentation/widgets/reminder': [],
    'lib/presentation/widgets/category': [],
    'lib/presentation/widgets/navigation': [
      'bottom_navbar.dart'
    ],

    'lib/presentation/screens/splash': [
      'splash_screen.dart'
    ],
    'lib/presentation/screens/onboarding': [
      'onboarding_screen.dart'
    ],
    'lib/presentation/screens/auth': [
      'login_screen.dart',
      'register_screen.dart',
      'forgot_password_screen.dart'
    ],
    'lib/presentation/screens/home': [
      'home_screen.dart'
    ],
    'lib/presentation/screens/notes': [
      'create_note_screen.dart',
      'edit_note_screen.dart',
      'note_detail_screen.dart',
      'note_preview_screen.dart'
    ],
    'lib/presentation/screens/search': [
      'search_screen.dart'
    ],
    'lib/presentation/screens/category': [
      'category_screen.dart'
    ],
    'lib/presentation/screens/reminder': [
      'reminder_screen.dart'
    ],
    'lib/presentation/screens/favorite': [
      'favorite_screen.dart'
    ],
    'lib/presentation/screens/trash': [
      'trash_screen.dart'
    ],
    'lib/presentation/screens/profile': [
      'profile_screen.dart'
    ],
    'lib/presentation/screens/statistics': [
      'statistics_screen.dart'
    ],
    'lib/presentation/screens/settings': [
      'settings_screen.dart'
    ],

    'test/unit_test': [],
    'test/widget_test': [],
    'test/integration_test': [],
    
    'lib': [
      'firebase_options.dart'
    ]
  };

  structure.forEach((dirPath, files) {
    final dir = Directory(dirPath);
    if (!dir.existsSync()) {
      dir.createSync(recursive: true);
      print('Created directory: $dirPath');
    }

    for (var file in files) {
      final filePath = '$dirPath/$file';
      final f = File(filePath);
      if (!f.existsSync()) {
        f.createSync();
        // Add basic comment
        f.writeAsStringSync('// TODO: Implement $file\n');
        print('Created file: $filePath');
      }
    }
  });

  print('Structure generation completed successfully!');
}
