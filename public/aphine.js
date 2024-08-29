document.addEventListener("alpine:init", () => {
    Alpine.data("price_plan", () => ({
      
      phoneBillCalculator() {
        return {
          pricePlan: "",
          actions: "",
          result: "",
          error: "",
  
          async calculatePhoneBill() {
            try {
              // Clear previous results
              this.result = "";
              this.error = "";
  
              const response = await fetch(`/api/phonebill/`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  price_plan: this.pricePlan,
                  actions: this.actions,
                }),
              });
  
              const data = await response.json();
  
              if (response.ok) {
                this.result = data.total;
              } else {
                this.error = data.error;
              }
              setTimeout(() => {
                this.result = "";
                this.pricePlan = "";
                this.actions = "";
              }, 5000);
            } catch (err) {
              this.error = "An unexpected error occurred.";
            }
          },
        };
      },
  
      pricePlansFetcher() {
        return {
          pricePlans: [],
          loading: false,
          error: '',
  
          async fetchPricePlans() {
            this.loading = true;
            this.error = '';
            this.pricePlans = [];
  
            try {
              const response = await fetch(`/api/price_plans/`);
              const data = await response.json();
  
              if (response.ok) {
                this.pricePlans = data;
              } else {
                this.error = 'Failed to load price plans.';
              }
              
            } catch (err) {
              this.error = 'An unexpected error occurred.';
            } finally {
              this.loading = false;
            }
          },
        };
      },
  
      pricePlanCreator() {
        return {
          name: '',
          callCost: '',
          smsCost: '',
          message: '',
          error: '',
  
          async createPricePlan() {
            try {
              // Clear previous messages
              this.message = '';
              this.error = '';
  
              const response = await fetch(`/api/price_plan/create`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  name: this.name,
                  call_cost: this.callCost,
                  sms_cost: this.smsCost,
                }),
              });
  
              const data = await response.json();
  
              if (response.ok) {
                this.message = data.message;
                this.name = '';
                this.callCost = '';
                this.smsCost = '';
                alert(this.message);
              } else {
                this.error = 'Failed to create price plan.';
                alert(this.error);
                setTimeout(() => {
                  this.name = "";
                  this.callCost = "";
                  this.smsCost = "";
                  this.message = "";
                  this.error = "";
                }, 3700);
              }
            } catch (err) {
              this.error = 'An unexpected error occurred.';
            }
          },
        };
      },
  
      pricePlanUpdater() {
        return {
          name: '',
          callCost: '',
          smsCost: '',
          message: '',
          error: '',
  
          async updatePricePlan() {
            try {
              // Clear previous messages
              this.message = '';
              this.error = '';
  
              const response = await fetch(`/api/price_plan/update`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  name: this.name,
                  call_cost: this.callCost,
                  sms_cost: this.smsCost,
                }),
              });
  
              const data = await response.json();
  
              if (response.ok) {
                this.message = data.message;
                this.name = '';
                this.callCost = '';
                this.smsCost = '';
                alert(this.message);
              } else {
                this.error = 'Failed to update price plan.';
                alert(this.error);
              }
            } catch (err) {
              this.error = 'An unexpected error occurred.';
            }
          },
        };
      },
  
      pricePlanDeleter() {
        return {
          id: '',
          message: '',
          error: '',
  
          async deletePricePlan() {
            try {
              // Clear previous messages
              this.message = '';
              this.error = '';
  
              const response = await fetch(`/api/price_plan/delete`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  id: this.id,
                }),
              });
  
              const data = await response.json();
  
              if (response.ok) {
                this.message = data.message;
                this.id = ''; // Clear the input field after successful deletion
                alert(this.message);
                setTimeout(() => {
                  this.message = "";
      
                }, 5000);
              } else {
                this.error = 'Failed to delete price plan.';
              }
            } catch (err) {
              this.error = 'An unexpected error occurred.';
            }
          },
        };
      }
      
    }));
  });
  