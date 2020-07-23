# Single-page application for comparing packaging materials on environmental characteristics / Веб-приложение для сравнения упаковочных материалов по экологическим характеристикам
![Farmers Market Finder Demo](demo/PackComp.gif)

[Посмотреть проект](http://37.46.135.200/ "Ссылка на проект"). Для получения логина и пароля обратиться к автору, т.к. в проекте используются производственные данные.
---
### Используемые технологии ###
#### *Frontend*: Vue.js, Vuetify, ApexCharts, AXIOS, JSON Web Token ####
#### *Backend*: Node.js, MySQL, Bcrypt ####
---
Проект разработан по заказу немецкой компании Kloeckner Pentaplast GmbH & Co. Kg — мирового лидера по производству жестких ПВХ-пленок, используемых в качестве упаковочных материалов и для различных технических целей. 

На вход из базы данных подаются характеристики упаковок, упаковочных материалов и экологических критериев, которые пересчитываются по методу линейной свертки и представляются пользователю в виде гистограммы, лепестковой диаграммы и таблицы.
Исходя из полученных результатов пользователь может выбрать наиболее экологичную упаковку для производства.
