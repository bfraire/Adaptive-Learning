export interface Section {
  id: string;
  title: string;
  route: string | null;
}

export interface Chapter {
  id: number;
  title: string;
  sections: Section[];
}

export interface Book {
  id: string;
  title: string;
  source: string;
  summary: string;
  chapters: Chapter[];
}

export const CALCULUS_V1: Book = {
  id: "calculus-volume-1",
  title: "Calculus Volume 1",
  source: "OpenStax",
  summary:
    "Calculus is designed for the typical two- or three-semester general calculus course, incorporating innovative features to enhance student learning. The book guides students through the core concepts of calculus and helps them understand how those concepts apply to their lives and the world around them. Due to the comprehensive nature of the material, we are offering the book in three volumes for flexibility and efficiency. Volume 1 covers functions, limits, derivatives, and integration.",
  chapters: [
    {
      id: 1,
      title: "Functions",
      sections: [
        { id: "1.1", title: "Review of Functions", route: "/chapter/section-1-1" },
        { id: "1.2", title: "Basic Classes of Functions", route: null },
        { id: "1.3", title: "Trigonometric Functions", route: null },
        { id: "1.4", title: "Inverse Functions", route: null },
        { id: "1.5", title: "Exponential and Logarithmic Functions", route: null },
      ],
    },
    {
      id: 2,
      title: "Limits",
      sections: [
        { id: "2.1", title: "A Preview of Calculus", route: null },
        { id: "2.2", title: "The Limit of a Function", route: null },
        { id: "2.3", title: "The Limit Laws", route: null },
        { id: "2.4", title: "Continuity", route: null },
        { id: "2.5", title: "The Precise Definition of a Limit", route: null },
      ],
    },
    {
      id: 3,
      title: "Derivatives",
      sections: [
        { id: "3.1", title: "Defining the Derivative", route: null },
        { id: "3.2", title: "The Derivative as a Function", route: null },
        { id: "3.3", title: "Differentiation Rules", route: null },
        { id: "3.4", title: "Derivatives as Rates of Change", route: null },
        { id: "3.5", title: "Derivatives of Trigonometric Functions", route: null },
        { id: "3.6", title: "The Chain Rule", route: null },
        { id: "3.7", title: "Derivatives of Inverse Functions", route: null },
        { id: "3.8", title: "Implicit Differentiation", route: null },
        { id: "3.9", title: "Derivatives of Exponential and Logarithmic Functions", route: null },
      ],
    },
    {
      id: 4,
      title: "Applications of Derivatives",
      sections: [
        { id: "4.1", title: "Related Rates", route: null },
        { id: "4.2", title: "Linear Approximations and Differentials", route: null },
        { id: "4.3", title: "Maxima and Minima", route: null },
        { id: "4.4", title: "The Mean Value Theorem", route: null },
        { id: "4.5", title: "Derivatives and the Shape of a Graph", route: null },
        { id: "4.6", title: "Limits at Infinity and Asymptotes", route: null },
        { id: "4.7", title: "Applied Optimization Problems", route: null },
        { id: "4.8", title: "L'Hôpital's Rule", route: null },
        { id: "4.9", title: "Newton's Method", route: null },
        { id: "4.10", title: "Antiderivatives", route: null },
      ],
    },
    {
      id: 5,
      title: "Integration",
      sections: [
        { id: "5.1", title: "Approximating Areas", route: null },
        { id: "5.2", title: "The Definite Integral", route: null },
        { id: "5.3", title: "The Fundamental Theorem of Calculus", route: null },
        { id: "5.4", title: "Integration Formulas and the Net Change Theorem", route: null },
        { id: "5.5", title: "Substitution", route: null },
        { id: "5.6", title: "Integrals Involving Exponential and Logarithmic Functions", route: null },
        { id: "5.7", title: "Integrals Resulting in Inverse Trigonometric Functions", route: null },
      ],
    },
    {
      id: 6,
      title: "Applications of Integration",
      sections: [
        { id: "6.1", title: "Areas between Curves", route: null },
        { id: "6.2", title: "Determining Volumes by Slicing", route: null },
        { id: "6.3", title: "Volumes of Revolution: Cylindrical Shells", route: null },
        { id: "6.4", title: "Arc Length of a Curve and Surface Area", route: null },
        { id: "6.5", title: "Physical Applications", route: null },
        { id: "6.6", title: "Moments and Centers of Mass", route: null },
        { id: "6.7", title: "Integrals, Exponential Functions, and Logarithms", route: null },
        { id: "6.8", title: "Exponential Growth and Decay", route: null },
        { id: "6.9", title: "Calculus of the Hyperbolic Functions", route: null },
      ],
    },
  ],
};

export const BOOKS: Book[] = [CALCULUS_V1];
