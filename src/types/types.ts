export type ClockType = {
    id: number;
    hour: number;
    minute: number;
    confirmed: boolean;
}

export type OP = "increase" | "decrease"

export type TYPE = "hour" | "minute"

export type INPUT = "amount" | "minute"