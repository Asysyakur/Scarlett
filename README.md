<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework.

You may also try the [Laravel Bootcamp](https://bootcamp.laravel.com), where you will be guided through building a modern Laravel application from scratch.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com/)**
- **[Tighten Co.](https://tighten.co)**
- **[WebReinvent](https://webreinvent.com/)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel/)**
- **[Cyber-Duck](https://cyber-duck.co.uk)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Jump24](https://jump24.co.uk)**
- **[Redberry](https://redberry.international/laravel/)**
- **[Active Logic](https://activelogic.com)**
- **[byte5](https://byte5.de)**
- **[OP.GG](https://op.gg)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
#   l a r n s 
 


==================================================================================================================================================================
<br>    <br>   
# Scarlett Installation Guide
<br>   
## How to Run the Scarlett App
<br>   
Follow these steps to set up and run the Scarlett application on your local machine:
<br>   
### 1. Clone the Repository
<br>   
```bash
<br>   
git clone https://github.com/Asysyakur/Scarlett.git
<br>   
cd Scarlett
<br>   
```<br>   
<br>   
### 2. Install PHP Dependencies <br>   
Run the following command to install the required PHP dependencies: <br>   
```bash <br>   
composer install <br>   
``` <br>   
Then, install the `pusher-php-server` package: <br>   
```bash <br>   
composer require pusher/pusher-php-server <br>   
``` <br>  <br>    

### 3. Install Node.js Dependencies <br>   
Install the necessary Node.js dependencies: <br>   
```bash <br>   
npm install <br>   
``` <br>   <br>   

### 4. Set Up Environment Variables <br>   
1. Create a `.env` file in the project root directory (same level as `.env.example`): <br>   
   ```bash <br>   
   cp .env.example .env <br>   
   ``` <br>   
2. Modify the `.env` file with your specific configuration (e.g., database credentials). <br>   
<br>   
### 5. Run Database Migrations and Seeders  <br>   
Run the following commands to migrate the database and seed it with initial data: <br>   
```bash <br>   
php artisan migrate <br>   
php artisan db:seed <br>   
``` <br>    <br>   

### 6. Create a Symbolic Link for Storage <br>   
```bash <br>   
php artisan storage:link <br>
php artisan queue:work <br>
``` <br>    <br>   

### 7. Start the Development Server <br>   
Open two terminal windows or tabs: <br>   

**Terminal 1:** Start the Laravel backend: <br>   
```bash <br>   
php artisan serve <br>   
``` <br>   

**Terminal 2:** Compile assets and start the frontend development server: <br>   
```bash <br>    
npm run dev <br>   
``` <br>   
<br>   
### Access the Application <br>   
Once the servers are running, you can access the application in your browser at: <br>   
``` <br>   
http://localhost:8000 <br>   


 
