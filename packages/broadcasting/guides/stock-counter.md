# Flash Sale Stock Counter (High-Frequency Public Channel)

**Scenario**: Flash sale inventory ticker. All shoppers see available stock update live the moment any user completes a purchase.

## Backend

```php
$remainingStock = $productModel->decrementStock($productId, 1);

broadcast(new StockUpdated($productId, $remainingStock));
```

## Frontend

```javascript
ws.onmessage = (e) => {
    const frame = JSON.parse(e.data);
    if (frame.event === "StockUpdated") {
        document.getElementById("stockCounter").textContent = frame.data.stock + " left";
        if (frame.data.stock <= 0) {
            document.getElementById("buyBtn").disabled = true;
            document.getElementById("buyBtn").textContent = "Sold Out";
        }
    }
};
```
