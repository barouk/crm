#!/bin/sh

./wait-for-it.sh mysql:3306 --timeout=30 --strict -- echo "MySQL is up"

if [ ! -f /app/migrations_done ]; then

    python manage.py migrate
    python manage.py shell <<EOF
from django.contrib.auth import get_user_model
User = get_user_model()

username = "${DJANGO_SUPERUSER_USERNAME}"
email = "${DJANGO_SUPERUSER_EMAIL}"
password = "${DJANGO_SUPERUSER_PASSWORD}"

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username=username, email=email, password=password)
    print(f"Superuser {username} created")
else:
    print(f"Superuser {username} already exists")
EOF

    # ایجاد فایل پرچم برای نشان دادن اینکه مایگریشن‌ها انجام شده‌اند
    touch /app/migrations_done
else
    echo "Migrations and superuser creation already done."
fi


exec "$@"
