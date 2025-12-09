# como rodar o back

execute o docker

no terminal rode:
obs: isso so precisa ser feito uma vez. nas proximas vezes que for executar o projeto, inicie o docker pelo docker desktop

docker compose -d

npm i
npx prisma generate
npx prisma seed
npx prisma db push

npm run start:dev

# .env do front

NEXT_PUBLIC_API_URL=<http://localhost:3001/api>

# mock login admin no front

email: <admin@barber.com>
senha: admin123

# .env do back

DATABASE_URL="postgresql://barber_user:barber_pass@127.0.0.1:5434/barbershop_db?schema=public"

# Porta do servidor Backend (Para não conflitar com o Frontend na 3000)

PORT=3001
