"use client"

import { useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Star } from "lucide-react";
import { addRating } from "./actions";

export default function RatingDialog() {

    const [open, setOpen] = useState(true);
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);

    const handleSubmit = async () => {
        try {
            setOpen(false);
            setRating(0);
            setHoveredRating(0);
            await addRating(rating);
        } catch (error) {
            console.error('Error submitting rating:', error);
        }
    };

    const handleClose = () => {
        setOpen(false);
        setRating(0);
        setHoveredRating(0);
    };


    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Hogyan értékelné az oldalt?</DialogTitle>
                    <DialogDescription>
                        Értékelése segít számunkra
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center gap-6 py-6">
                    <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoveredRating(star)}
                                onMouseLeave={() => setHoveredRating(0)}
                                className="transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded"
                            >
                                <Star
                                    className={`w-10 h-10 transition-colors ${star <= (hoveredRating || rating)
                                        ? 'fill-yellow-400 text-yellow-400'
                                        : 'text-gray-300'
                                        }`}
                                />
                            </button>
                        ))}
                    </div>

                    {rating > 0 && (
                        <p className="text-sm text-gray-600 animate-in fade-in slide-in-from-bottom-2">
                            {rating === 1 && "Sajnáljuk :("}
                            {rating === 2 && "Dolgozunk, hogy jobb legyen az oldal"}
                            {rating === 3 && "Köszönjük a visszajelzést!"}
                            {rating === 4 && "Örülünk, hogy tetszett!"}
                            {rating === 5 && "Nagyszerű! Köszönjük szépen!"}
                        </p>
                    )}
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        className="mr-2"
                        type="button"
                        variant="outline"
                        onClick={handleClose}
                    >
                        Mégsem
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={rating === 0}
                    >
                        Beküldés
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}