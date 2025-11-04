# 🚀 Быстрая инструкция: Сборка без Expo

## Шаг 1: Создайте нативный Android проект

```bash
cd pizzaorder
npx expo prebuild --platform android
```

Это создаст папку `android/` с полным нативным Android проектом.

## Шаг 2: Установите зависимости

```bash
cd android
./gradlew clean
```

## Шаг 3: Соберите APK

```bash
# Debug версия (для тестирования)
./gradlew assembleDebug

# Release версия (для распространения)
./gradlew assembleRelease

# AAB для Google Play Store
./gradlew bundleRelease
```

## Шаг 4: Найдите APK файл

**Debug APK:**
```
android/app/build/outputs/apk/debug/app-debug.apk
```

**Release APK:**
```
android/app/build/outputs/apk/release/app-release.apk
```

**Release AAB:**
```
android/app/build/outputs/bundle/release/app-release.aab
```

---

## Требования

1. **JDK 17+** - установите с [adoptium.net](https://adoptium.net/)
2. **Android Studio** - установите с [developer.android.com/studio](https://developer.android.com/studio)
3. **Android SDK** - установите через Android Studio SDK Manager

## Настройка переменных окружения

**Windows:**
```powershell
$env:ANDROID_HOME = "C:\Users\YourUsername\AppData\Local\Android\Sdk"
$env:PATH += ";$env:ANDROID_HOME\tools;$env:ANDROID_HOME\platform-tools"
```

**Linux/Mac:**
```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

## Быстрая сборка (одной командой)

```bash
npm run prebuild:android && npm run build:android:local
```

---

📖 Подробная инструкция в файле `ANDROID_BUILD_LOCAL.md`

