# Локализация
1) Создать файл, содержащий все строки для локализации
    xgettext --from-code=UTF-8 --output=bitmonitor.pot *.js
2) Заменить неопределенную кодировку на UTF-8
    sed -i 's/charset=CHARSET/charset=UTF-8/g' bitmonitor.pot
3) Создать файлы локализации под разные языки
    #### Русский
    msginit -i bitmonitor.pot -l ru_RU.UTF-8 --no-translator --output-file=locale/ru_RU/LC_MESSAGES/bitmonitor.po
    #### Английский
    msginit -i bitmonitor.pot -l en.UTF-8 --no-translator --output-file=locale/en/LC_MESSAGES/bitmonitor.po
4) Вручную задать переводы
5) Скомпилировать файлы локализации
    msgfmt -o locale/ru_RU/LC_MESSAGES/bitmonitor.mo locale/ru_RU/LC_MESSAGES/bitmonitor.po
    msgfmt -o locale/en/LC_MESSAGES/bitmonitor.mo locale/en/LC_MESSAGES/bitmonitor.po
