import tkinter as tk
from tkinter import ttk

def convert():
    try:
        amount = float(amount_entry.get())
        rate = float(rate_entry.get())
        if currency_combobox.get() == "USD to FC":
            converted_amount = amount * rate
            result_label.config(text=f"{amount} USD = {converted_amount} FC")
        elif currency_combobox.get() == "FC to USD":
            converted_amount = amount / rate
            result_label.config(text=f"{amount} FC = {converted_amount} USD")
        else:
            result_label.config(text="Invalid currency selection")
    except ValueError:
        result_label.config(text="Invalid input")

# Create the main window
root = tk.Tk()
root.title("Currency Converter")

# Create widgets
amount_label = tk.Label(root, text="Amount:")
amount_label.grid(row=0, column=0, padx=10, pady=10)

amount_entry = tk.Entry(root)
amount_entry.grid(row=0, column=1, padx=10, pady=10)

currency_label = tk.Label(root, text="Currency:")
currency_label.grid(row=1, column=0, padx=10, pady=10)

currency_combobox = ttk.Combobox(root, values=["USD to FC", "FC to USD"])
currency_combobox.grid(row=1, column=1, padx=10, pady=10)
currency_combobox.current(0)

rate_label = tk.Label(root, text="Exchange Rate:")
rate_label.grid(row=2, column=0, padx=10, pady=10)

rate_entry = tk.Entry(root)
rate_entry.grid(row=2, column=1, padx=10, pady=10)

convert_button = tk.Button(root, text="Convert", command=convert)
convert_button.grid(row=3, column=0, columnspan=2, padx=10, pady=10)

result_label = tk.Label(root, text="")
result_label.grid(row=4, column=0, columnspan=2, padx=10, pady=10)

# Run the main event loop
root.mainloop()
