# Komunikator-IO2022

## Cel projektu
Celem projektu jest stworzenie komunikatora internetowego z funkcją udostępnienia whiteboard i jednocześnie projekt zaliczeniowy na przedmiot Inżynieria oprogramowania 

## Autorzy
  - Kamil Vogel
  - Jacek Chrząszczyk
  - Bartosz Bartosik

## Funkcjonalność
  - Aplikacja internetowa
  - System rejestracji użytkownika (login i hasło)
  - Komunikacja miedzy użytkownikami przy pomocy wiadomości tekstowych
  - Możliwość usuwania swoich wiadomości 
  - Udostępnianie whiteboarda podczas chatu
  - System powiadomień o dołączeniu nowego użytkownika do chatu

## Technologie
  - HTML
  - CSS
  - Node.js
  - Socket.io
  - Express

## Testowanie
Aplikacje mozna przetestowac na branchach: 

Main - https://projektnastudia.azurewebsites.net/

Development https://projektnastudia-stage.azurewebsites.net/

## Ręczny deployment 

Kroki aby uruchomic aplikacje lokalnie :

0. Instalacja ``npm`` oraz ``node.js``
1. Sklonowanie repo
``
git clone https://github.com/KamilVogel/Komunikator-IO2022.git; cd Komunikator-IO2022
``
2. Instalacja wymaganych zaleznosci
``
npm install
``
3. Uruchomienie aplikacji
``
npm start
``
Po uruchomieniu powiinen sie wywietlic komunikat o pomyslnym uruchomieniu aplikacji. Na przykład:
````
user@DESKTOP:~/Komunikator-IO2022$ npm start

> komunikator-io2022@1.0.0 start ~/Komunikator-IO2022
> node server.js

App started!
Listening at port : 3000
````
