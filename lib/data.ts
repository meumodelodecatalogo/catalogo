export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  active: boolean;
  tags?: string[];
}

export const PIZZARIA_CONFIG = {
  name: "Di Caza Pizzaria",
  whatsapp: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "",
  pizzaSizes: [
    { id: "small", name: "Pequena", multiplier: 0.7 },
    { id: "medium", name: "Média", multiplier: 1.0 },
    { id: "large", name: "Grande", multiplier: 1.3 },
  ],
};

export const categories = [
  "Pizzas Tradicionais",
  "Pizzas Especiais",
  "Pizzas Doces",
  "Bebidas",
  "Extras",
];

export const products: Product[] = [
  {
    id: "1",
    name: "Margherita Premium",
    description: "Molho de tomate artesanal, muçarela de búfala, manjericão fresco e azeite extra virgem.",
    price: 45.90,
    category: "Pizzas Tradicionais",
    imageUrl: "https://picsum.photos/seed/margherita/800/600",
    active: true,
    tags: ["Vegetariana", "Mais Pedida"],
  },
  {
    id: "2",
    name: "Calabresa Especial",
    description: "Muçarela, calabresa fatiada premium, cebola roxa, azeitonas pretas e orégano.",
    price: 42.90,
    category: "Pizzas Tradicionais",
    imageUrl: "https://picsum.photos/seed/calabresa/800/600",
    active: true,
  },
  {
    id: "3",
    name: "Trufada de Cogumelos",
    description: "Mix de cogumelos frescos, creme de leite trufado, muçarela e finalizada com cebolinha.",
    price: 68.90,
    category: "Pizzas Especiais",
    imageUrl: "https://picsum.photos/seed/mushroom/800/600",
    active: true,
    tags: ["Gourmet", "Vegetariana"],
  },
  {
    id: "4",
    name: "Burrata e Pesto",
    description: "Molho pomodoro, burrata inteira ao centro, pesto de manjericão e tomates cereja.",
    price: 72.90,
    category: "Pizzas Especiais",
    imageUrl: "https://picsum.photos/seed/burrata/800/600",
    active: true,
    tags: ["Exclusiva"],
  },
  {
    id: "5",
    name: "Chocolate com Morango",
    description: "Chocolate meio amargo derretido, morangos frescos e raspas de chocolate branco.",
    price: 48.90,
    category: "Pizzas Doces",
    imageUrl: "https://picsum.photos/seed/strawberry/800/600",
    active: true,
  },
  {
    id: "6",
    name: "Nutella com Ninho",
    description: "Base de Nutella generosa, leite Ninho polvilhado e avelãs picadas.",
    price: 52.90,
    category: "Pizzas Doces",
    imageUrl: "https://picsum.photos/seed/nutella/800/600",
    active: true,
  },
  {
    id: "7",
    name: "Coca-Cola 2L",
    description: "Refrigerante gelado 2 litros.",
    price: 14.00,
    category: "Bebidas",
    imageUrl: "https://picsum.photos/seed/coke/800/600",
    active: true,
  },
  {
    id: "8",
    name: "Suco de Laranja Natural",
    description: "Suco de laranja 100% natural 500ml.",
    price: 12.00,
    category: "Bebidas",
    imageUrl: "https://picsum.photos/seed/orange/800/600",
    active: true,
  },
  {
    id: "9",
    name: "Borda Recheada Catupiry",
    description: "Adicional de borda recheada com o verdadeiro Catupiry.",
    price: 10.00,
    category: "Extras",
    imageUrl: "https://picsum.photos/seed/crust/800/600",
    active: true,
  },
];
