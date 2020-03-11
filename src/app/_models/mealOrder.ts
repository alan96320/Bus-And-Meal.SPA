export interface MealOrder {
  orderDetail: OrderDetail[];
  mealTypeColumn: MealTypeColumn[];
}

export interface OrderDetail {
  date: string;
  department: string;
  mealtypeid: number;
  total: number;
}

export interface MealTypeColumn {
  id: number;
  name: string;
}
