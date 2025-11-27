Crear Adminsitrador Global
http://localhost:8080/auth/register

{
  "email": "admin@example.com",
  "password": "123456",
  "fullName": "Administrador Global"
}


LOGIN Administrador Global
http://localhost:8080/auth/login
  {
    "email": "admin@example.com",
    "password": "123456"
  }

IMPORTANTE --> Añadir Token en Postman Authorization: Bearer TU_TOKEN_AQUI

CREAR Colegio
http://localhost:8080/admin/schools
{
  "name": "Unidad Educativa Sudamericano",
  "address": "Ricaurte"
}
Guardar ID

CREAR ADMINISTRADOR PARA COLEGIO
http://localhost:8080/admin/schools/{ID_DEL_COLEGIO}/admin
{
  "email": "admincolegio@fct.com",
  "password": "123456",
  "fullName": "Admin Colegio Cuenca"
}

CREAR UNA EMPRESA
http://localhost:8080/admin/companies
{
  "id": "UUID",
  "name": "Sumin Industrial",
  "address": "Av. México 321"
}


CREAR ADMINISTRADOR PARA EMPRESA
http://localhost:8080/admin/companies/{ID_EMPRESA}/admin
{
  "email": "empresaadmin@fct.com",
  "password": "123456",
  "fullName": "Admin Empresa Sumin"
}

LISTAR COLEGIOS POSTMAN
http://localhost:8080/public/schools
LISTAR EMPRESAS POSTMAN
http://localhost:8080/public/companies

LOGIN COMO ADMIN COLEGIO ---> Debe devolver roles: ["SCHOOL_ADMIN"]
http://localhost:8080/auth/login

LOGIN COMO ADMIN EMPRESA ---> ✔ Debe devolver roles: ["COMPANY_ADMIN"]



 
