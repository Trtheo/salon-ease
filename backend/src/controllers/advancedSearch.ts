import { Request, Response } from 'express';
import Salon from '../models/Salon';
import Service from '../models/Service';

// Advanced salon search
export const advancedSalonSearch = async (req: Request, res: Response) => {
  try {
    const {
      q, // search query
      location,
      minPrice,
      maxPrice,
      minRating,
      services,
      sortBy = 'rating',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    // Build search filter
    const filter: any = { status: 'approved' };

    // Text search
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }

    // Location filter
    if (location) {
      filter.address = { $regex: location, $options: 'i' };
    }

    // Rating filter
    if (minRating) {
      filter.rating = { $gte: parseFloat(minRating as string) };
    }

    // Get salons with basic filters
    let salons = await Salon.find(filter)
      .populate('services')
      .populate('owner', 'name');

    // Service filter (after population)
    if (services) {
      const serviceNames = (services as string).split(',');
      salons = salons.filter(salon => 
        salon.services.some((service: any) => 
          serviceNames.some(name => 
            service.name.toLowerCase().includes(name.toLowerCase())
          )
        )
      );
    }

    // Price filter (based on services)
    if (minPrice || maxPrice) {
      salons = salons.filter(salon => {
        const salonServices = salon.services as any[];
        const prices = salonServices.map(s => s.price);
        const minSalonPrice = Math.min(...prices);
        const maxSalonPrice = Math.max(...prices);

        let matchesPrice = true;
        if (minPrice) {
          matchesPrice = matchesPrice && minSalonPrice >= parseFloat(minPrice as string);
        }
        if (maxPrice) {
          matchesPrice = matchesPrice && maxSalonPrice <= parseFloat(maxPrice as string);
        }
        return matchesPrice;
      });
    }

    // Sort results
    salons.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'rating':
          aValue = a.rating;
          bValue = b.rating;
          break;
        case 'price':
          const aServices = a.services as any[];
          const bServices = b.services as any[];
          aValue = aServices.length ? Math.min(...aServices.map(s => s.price)) : 0;
          bValue = bServices.length ? Math.min(...bServices.map(s => s.price)) : 0;
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        default:
          aValue = a.createdAt;
          bValue = b.createdAt;
      }

      if (sortOrder === 'desc') {
        return aValue > bValue ? -1 : 1;
      }
      return aValue < bValue ? -1 : 1;
    });

    // Pagination
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    
    const paginatedSalons = salons.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedSalons,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total: salons.length,
        pages: Math.ceil(salons.length / limitNum)
      },
      filters: {
        query: q,
        location,
        priceRange: { min: minPrice, max: maxPrice },
        minRating,
        services: services ? (services as string).split(',') : [],
        sortBy,
        sortOrder
      }
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Search services
export const searchServices = async (req: Request, res: Response) => {
  try {
    const {
      q,
      category,
      minPrice,
      maxPrice,
      minDuration,
      maxDuration,
      salonId,
      sortBy = 'price',
      sortOrder = 'asc',
      page = 1,
      limit = 20
    } = req.query;

    const filter: any = { isActive: true };

    // Text search
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } }
      ];
    }

    // Category filter
    if (category) {
      filter.category = { $regex: category, $options: 'i' };
    }

    // Price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice as string);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice as string);
    }

    // Duration range
    if (minDuration || maxDuration) {
      filter.duration = {};
      if (minDuration) filter.duration.$gte = parseInt(minDuration as string);
      if (maxDuration) filter.duration.$lte = parseInt(maxDuration as string);
    }

    // Salon filter
    if (salonId) {
      filter.salon = salonId;
    }

    // Sort options
    const sortOptions: any = {};
    sortOptions[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    const services = await Service.find(filter)
      .populate('salon', 'name rating')
      .sort(sortOptions)
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum);

    const total = await Service.countDocuments(filter);

    res.json({
      success: true,
      data: services,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get search filters/options
export const getSearchFilters = async (req: Request, res: Response) => {
  try {
    // Get available categories
    const categories = await Service.distinct('category');
    
    // Get price range
    const priceRange = await Service.aggregate([
      { $group: { _id: null, min: { $min: '$price' }, max: { $max: '$price' } } }
    ]);

    // Get duration range
    const durationRange = await Service.aggregate([
      { $group: { _id: null, min: { $min: '$duration' }, max: { $max: '$duration' } } }
    ]);

    // Get rating range
    const ratingRange = await Salon.aggregate([
      { $group: { _id: null, min: { $min: '$rating' }, max: { $max: '$rating' } } }
    ]);

    res.json({
      success: true,
      data: {
        categories,
        priceRange: priceRange[0] || { min: 0, max: 1000 },
        durationRange: durationRange[0] || { min: 15, max: 240 },
        ratingRange: ratingRange[0] || { min: 0, max: 5 },
        sortOptions: [
          { value: 'rating', label: 'Rating' },
          { value: 'price', label: 'Price' },
          { value: 'name', label: 'Name' },
          { value: 'createdAt', label: 'Newest' }
        ]
      }
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Popular searches
export const getPopularSearches = async (req: Request, res: Response) => {
  try {
    // Get most popular service categories
    const popularCategories = await Service.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Get top-rated salons
    const topSalons = await Salon.find({ status: 'approved' })
      .sort({ rating: -1, reviewCount: -1 })
      .limit(5)
      .select('name rating reviewCount');

    res.json({
      success: true,
      data: {
        popularCategories: popularCategories.map(cat => cat._id),
        topRatedSalons: topSalons,
        suggestedSearches: [
          'haircut',
          'manicure',
          'facial',
          'massage',
          'hair coloring'
        ]
      }
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};