import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.foodItem.deleteMany()

  // Create food items
  const foodItems = [
    { nameUz: "Hotdog 5 tasi 1 da", nameRu: "Хотдог 5 штук за 1", price: 10000, category: "hotdog", available: true },
    { nameUz: "Hotdog 5 tasi 1 da (Big)", nameRu: "Хотдог 5 штук за 1 (Большой)", price: 15000, category: "hotdog", available: true },
    { nameUz: "Gamburger 5 tasi 1 da", nameRu: "Гамбургер 5 штук за 1", price: 12000, category: "burger", available: true },
    { nameUz: "Chicken Burger 5 tasi 1 da", nameRu: "Чикен Бургер 5 штук за 1", price: 13000, category: "burger", available: true },
    { nameUz: "Gamburger", nameRu: "Гамбургер", price: 8000, category: "burger", available: true },
    { nameUz: "DablBurger", nameRu: "ДаблБургер", price: 15000, category: "burger", available: true },
    { nameUz: "Chizburger", nameRu: "Чизбургер", price: 9000, category: "burger", available: true },
    { nameUz: "DablChizburger", nameRu: "ДаблЧизбургер", price: 17000, category: "burger", available: true },
    { nameUz: "ChickenDog 5 tasi 1 da", nameRu: "ЧикенДог 5 штук за 1", price: 11000, category: "hotdog", available: true },
    { nameUz: "Hot-Dog", nameRu: "Хот-Дог", price: 7000, category: "hotdog", available: true },
    { nameUz: "Hot-Dog (big)", nameRu: "Хот-Дог (большой)", price: 10000, category: "hotdog", available: true },
    { nameUz: "Kartoshka Fri", nameRu: "Картошка Фри", price: 6000, category: "sides", available: true },
    { nameUz: "Coca Cola 0.5", nameRu: "Кока Кола 0.5", price: 4000, category: "drinks", available: true },
    { nameUz: "ChickenBurger", nameRu: "ЧикенБургер", price: 10000, category: "burger", available: true },
    { nameUz: "IceCoffee", nameRu: "АйсКофе", price: 8000, category: "drinks", available: true },
    { nameUz: "Klab Sendwich", nameRu: "Клаб Сэндвич", price: 14000, category: "sandwich", available: true },
    { nameUz: "Klab Sendwich Fri bilan", nameRu: "Клаб Сэндвич с Фри", price: 18000, category: "combo", available: true },
    { nameUz: "Fri va Cola", nameRu: "Фри и Кола", price: 10000, category: "combo", available: true },
    { nameUz: "Naggets 4", nameRu: "Наггетсы 4", price: 8000, category: "sides", available: true },
    { nameUz: "Naggets 8", nameRu: "Наггетсы 8", price: 14000, category: "sides", available: true },
    { nameUz: "Strips", nameRu: "Стрипсы", price: 12000, category: "sides", available: true },
    { nameUz: "Moxito Classic", nameRu: "Мохито Классик", price: 9000, category: "drinks", available: true },
    { nameUz: "Combo 2", nameRu: "Комбо 2", price: 20000, category: "combo", available: true },
    { nameUz: "Chizburger set 4", nameRu: "Чизбургер сет 4", price: 25000, category: "combo", available: true },
    { nameUz: "Gigant Hot-Dog", nameRu: "Гигант Хот-Дог", price: 12000, category: "hotdog", available: true },
    { nameUz: "Ice-Tea", nameRu: "Айс-Ти", price: 5000, category: "drinks", available: true },
  ]

  for (const item of foodItems) {
    await prisma.foodItem.create({
      data: item
    })
  }

  // Create default admin user
  const bcrypt = require('bcryptjs')
  const hashedPassword = await bcrypt.hash('parolyoq', 10)
  
  await prisma.adminUser.upsert({
    where: { username: 'dendyuz' },
    update: {},
    create: {
      username: 'dendyuz',
      password: hashedPassword
    }
  })

  console.log('Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })