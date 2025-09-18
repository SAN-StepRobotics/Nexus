// Landing page API functions

export async function getLandingPageData() {
  return {
    features: [
      {
        title: "Multi-Tenant Architecture",
        description: "Complete isolation between companies with their own data and settings",
        icon: "building"
      },
      {
        title: "Google Drive Integration", 
        description: "Automatic file organization with dynamic folder creation",
        icon: "hard-drive"
      },
      {
        title: "Role-Based Access",
        description: "Granular permissions and user management",
        icon: "users"
      },
      {
        title: "Real-Time Analytics",
        description: "Performance tracking and insights",
        icon: "bar-chart"
      }
    ],
    pricingPlans: [
      {
        name: "Starter",
        price: "$29",
        period: "month",
        features: [
          "Up to 10 users",
          "Basic task management",
          "Google Drive integration",
          "Email support"
        ]
      },
      {
        name: "Professional", 
        price: "$79",
        period: "month",
        features: [
          "Up to 50 users",
          "Advanced analytics",
          "Custom categories",
          "Priority support",
          "API access"
        ]
      },
      {
        name: "Enterprise",
        price: "Custom",
        period: "month", 
        features: [
          "Unlimited users",
          "White-label solution",
          "Dedicated support",
          "Custom integrations",
          "SLA guarantee"
        ]
      }
    ]
  }
}