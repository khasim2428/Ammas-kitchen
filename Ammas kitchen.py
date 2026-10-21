import tkinter as tk
from tkinter import ttk


class AmmasKitchenApp:
    """A monthly lunch-box planner for Amma's Kitchen."""

    BG = "#fff8ee"
    CARD = "#ffffff"
    GREEN = "#315d3b"
    DARK = "#25352a"
    MUTED = "#69756b"
    GOLD = "#d5a34a"

    PLANS = {
        "Basic Veg — ₹3,499/month": {
            "price": "₹3,499 / month",
            "description": (
                "Rice / roti  •  Dal / sambar / rasam\n"
                "Seasonal vegetable curries  •  Curd\n"
                "Pickle / chutney"
            ),
        },
        "Standard Veg — price on request": {
            "price": "Price on request",
            "description": "Ask us about menu options and package details.",
        },
        "Premium Veg — price on request": {
            "price": "Price on request",
            "description": "Ask us about menu options and package details.",
        },
    }

    def __init__(self, root):
        self.root = root
        root.title("Amma's Kitchen | Monthly Lunch Plans")
        root.geometry("650x790")
        root.minsize(580, 700)
        root.configure(bg=self.BG)

        style = ttk.Style()
        style.configure("Kitchen.TCombobox", padding=7, font=("Arial", 10))

        header = tk.Frame(root, bg=self.GREEN, padx=26, pady=22)
        header.pack(fill="x")
        tk.Label(header, text="AMMA'S KITCHEN", font=("Arial", 23, "bold"),
                 bg=self.GREEN, fg="#fff8ee").pack()
        tk.Label(header, text="HOMEMADE CARE • FRESH EVERY DAY • MADE WITH LOVE",
                 font=("Arial", 9, "bold"), bg=self.GREEN, fg="#e8d9b7").pack(pady=(6, 0))
        tk.Frame(header, bg=self.GOLD, height=2).pack(fill="x", pady=(15, 0))

        tk.Label(root, text="A happier lunch, all month long", font=("Arial", 17, "bold"),
                 bg=self.BG, fg=self.DARK).pack(pady=(18, 3))
        tk.Label(root, text="Choose your monthly lunch box plan and pack with confidence.",
                 font=("Arial", 10), bg=self.BG, fg=self.MUTED).pack(pady=(0, 16))

        content = tk.Frame(root, bg=self.BG)
        content.pack(fill="both", expand=True, padx=28)

        plan_card = tk.Frame(content, bg=self.CARD, highlightthickness=1,
                             highlightbackground="#eadfce", padx=18, pady=14)
        plan_card.pack(fill="x")
        tk.Label(plan_card, text="MONTHLY LUNCH PLANS", font=("Arial", 10, "bold"),
                 bg=self.CARD, fg=self.GREEN).pack(anchor="w")
        self.plan_var = tk.StringVar(value="Basic Veg — ₹3,499/month")
        self.plan_menu = ttk.Combobox(plan_card, textvariable=self.plan_var,
                                      values=list(self.PLANS), state="readonly",
                                      style="Kitchen.TCombobox")
        self.plan_menu.pack(fill="x", pady=(8, 10))
        self.plan_menu.bind("<<ComboboxSelected>>", self.update_plan_details)
        self.plan_price = tk.Label(plan_card, text="", font=("Arial", 13, "bold"),
                                   bg=self.CARD, fg=self.GREEN)
        self.plan_price.pack(anchor="w")
        self.plan_description = tk.Label(plan_card, text="", justify="left", anchor="w",
                                         font=("Arial", 10), bg=self.CARD, fg=self.DARK,
                                         wraplength=540)
        self.plan_description.pack(fill="x", pady=(6, 0))
        self.update_plan_details()

        form = tk.Frame(content, bg=self.BG)
        form.pack(fill="x", pady=(14, 0))
        tk.Label(form, text="Lunch box for", font=("Arial", 10, "bold"),
                 bg=self.BG, fg=self.DARK).grid(row=0, column=0, sticky="w", pady=6)
        self.name_entry = tk.Entry(form, font=("Arial", 10), relief="solid", bd=1)
        self.name_entry.grid(row=0, column=1, sticky="ew", padx=(14, 0), ipady=6)
        self.name_entry.insert(0, "Family")

        tk.Label(form, text="Main dish", font=("Arial", 10, "bold"),
                 bg=self.BG, fg=self.DARK).grid(row=1, column=0, sticky="w", pady=6)
        self.main_var = tk.StringVar(value="Lemon rice")
        ttk.Combobox(form, textvariable=self.main_var,
                     values=("Lemon rice", "Vegetable pulao", "Chapati & curry",
                             "Curd rice", "Idli"), state="readonly",
                     style="Kitchen.TCombobox").grid(row=1, column=1, sticky="ew", padx=(14, 0))

        tk.Label(form, text="Side", font=("Arial", 10, "bold"),
                 bg=self.BG, fg=self.DARK).grid(row=2, column=0, sticky="w", pady=6)
        self.side_var = tk.StringVar(value="Cucumber slices")
        ttk.Combobox(form, textvariable=self.side_var,
                     values=("Cucumber slices", "Carrot sticks", "Fruit",
                             "Yogurt", "Roasted chickpeas"), state="readonly",
                     style="Kitchen.TCombobox").grid(row=2, column=1, sticky="ew", padx=(14, 0))
        form.columnconfigure(1, weight=1)

        tk.Label(content, text="PACKING CHECKLIST", font=("Arial", 10, "bold"),
                 bg=self.BG, fg=self.GREEN).pack(anchor="w", pady=(16, 7))
        checklist = tk.Frame(content, bg=self.BG)
        checklist.pack(fill="x")
        self.check_vars = {}
        for index, item in enumerate(("Lunch box", "Water bottle", "Napkin",
                                      "Spoon / fork", "Ice pack (if needed)")):
            var = tk.BooleanVar(value=False)
            self.check_vars[item] = var
            tk.Checkbutton(checklist, text=item, variable=var, bg=self.BG,
                           activebackground=self.BG, font=("Arial", 10),
                           fg=self.DARK, selectcolor="#e5efdf").grid(
                               row=index // 3, column=index % 3, sticky="w", padx=(0, 10), pady=3)

        tk.Button(content, text="CREATE MY LUNCH PLAN", command=self.create_plan,
                  bg=self.GREEN, activebackground="#274b30", fg="white",
                  activeforeground="white", font=("Arial", 10, "bold"),
                  relief="flat", padx=16, pady=10, cursor="hand2").pack(pady=13)
        self.result = tk.Label(content, text="", justify="left", anchor="w",
                               wraplength=560, bg="#f1eadc", fg=self.DARK,
                               font=("Arial", 10), padx=12, pady=10)
        self.result.pack(fill="x")
        tk.Label(root, text="Thank you for making us part of your family's table!",
                 font=("Arial", 9, "italic"), bg=self.BG, fg=self.MUTED).pack(pady=(10, 12))

    def update_plan_details(self, _event=None):
        plan = self.PLANS[self.plan_var.get()]
        self.plan_price.config(text=plan["price"])
        self.plan_description.config(text=plan["description"])

    def create_plan(self):
        name = self.name_entry.get().strip() or "Family"
        packed = [item for item, var in self.check_vars.items() if var.get()]
        missing = [item for item, var in self.check_vars.items() if not var.get()]
        checklist = "\n".join(
            f"{'✓' if item in packed else '□'} {item}" for item in self.check_vars
        )
        status = "Everything is ready!" if not missing else "Still to pack: " + ", ".join(missing)
        self.result.config(text=(
            f"Lunch box for {name}  |  {self.plan_var.get()}\n"
            f"Main: {self.main_var.get()}  •  Side: {self.side_var.get()}\n\n"
            f"{checklist}\n\n{status}"
        ))


if __name__ == "__main__":
    window = tk.Tk()
    AmmasKitchenApp(window)
    window.mainloop()