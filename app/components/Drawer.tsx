import { useState } from 'react';
import { useNavigate } from '@remix-run/react';
import { FaFilter, FaTrash } from 'react-icons/fa';

import type { Bike } from '@prisma/client';
import type { ChangeEventHandler } from 'react';
import type { SerializeFrom } from '@remix-run/node';

type DrawerSideProps = {
  colors: SerializeFrom<Bike['color']>[];
};

export default function DrawerSide({ colors }: DrawerSideProps) {
  const navigate = useNavigate();
  const [filterData, setFilterData] = useState({
    model: '',
    color: '',
    rating: '',
    location: '',
    endDate: '',
    startDate: '',
  });

  const clearFilters = () => {
    navigate('/bikes');
  };

  const handleFilterChange =
    (name: keyof typeof filterData): ChangeEventHandler =>
    (e) => {
      const value = (e.target as HTMLInputElement).value;
      setFilterData({ ...filterData, [name]: value });
    };

  const handleColorChange = (color: string) => () => {
    setFilterData({ ...filterData, color });
  };

  const handleFilterClick = () => {
    const searchParams = new URLSearchParams(Object.entries(filterData));
    const url = `/bikes?${searchParams}`;
    const toggler = document.getElementById('filter') as HTMLInputElement;
    toggler.checked = false;
    navigate(url);
  };

  return (
    <div className="drawer-side">
      <label htmlFor="filter" className="drawer-overlay" />
      <ul className="menu-compact h-full p-4 overflow-y-auto w-80 bg-base-100 text-base-content">
        <li>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">When do you want to reserve the bike?</span>
            </label>
            <div className="flex">
              <p className="font-light">Start Date:</p>
              <input
                type="date"
                name="startDate"
                placeholder="startDate"
                value={filterData.startDate}
                onChange={handleFilterChange('startDate')}
                className="input input-bordered w-full mb-2"
              />
            </div>
            <div className="flex">
              <p className="font-light">End Date: </p>
              <input
                type="date"
                name="endDate"
                placeholder="endDate"
                value={filterData.endDate}
                onChange={handleFilterChange('endDate')}
                className="input input-bordered w-full"
              />
            </div>
          </div>
        </li>
        <li>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">What model are you looking for?</span>
            </label>
            <input
              type="text"
              name="model"
              placeholder="Model Name"
              value={filterData.model}
              onChange={handleFilterChange('model')}
              className="input input-bordered w-full max-w-xs"
            />
          </div>
        </li>
        <li>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">Where do you want the bike to be?</span>
            </label>
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={filterData.location}
              onChange={handleFilterChange('location')}
              className="input input-bordered w-full max-w-xs"
            />
          </div>
        </li>
        <li>
          <label className="label">
            <span className="label-text">What color bike are you looking for?</span>
          </label>
          <div className="grid grid-cols-6 gap-2 max-h-16 overflow-x-hidden overflow-y-auto">
            {colors.map((color) => (
              <div
                key={color}
                onClick={handleColorChange(color)}
                className="text-neutral-content rounded-full w-6 h-6 cursor-pointer"
                style={{
                  backgroundColor: color,
                  border: filterData.color === color ? '2px solid black' : 'none',
                }}
              />
            ))}
          </div>
        </li>
        <li>
          <div className="form-control w-full max-w-xs">
            <label className="label">
              <span className="label-text">What should the minimum rating be?</span>
            </label>
            <div className="rating rating-lg py-5 flex justify-center">
              <input
                value="0"
                type="radio"
                name="rating"
                checked={!filterData.rating}
                onChange={handleFilterChange('rating')}
                className="mask mask-star-2 rating-hidden"
              />
              <input
                value="1"
                type="radio"
                name="rating"
                checked={filterData.rating === '1'}
                onChange={handleFilterChange('rating')}
                className="mask mask-star-2 bg-orange-400"
              />
              <input
                value="2"
                type="radio"
                name="rating"
                checked={filterData.rating === '2'}
                onChange={handleFilterChange('rating')}
                className="mask mask-star-2 bg-orange-400"
              />
              <input
                value="3"
                type="radio"
                name="rating"
                defaultChecked
                checked={filterData.rating === '3'}
                onChange={handleFilterChange('rating')}
                className="mask mask-star-2 bg-orange-400"
              />
              <input
                value="4"
                type="radio"
                name="rating"
                checked={filterData.rating === '4'}
                onChange={handleFilterChange('rating')}
                className="mask mask-star-2 bg-orange-400"
              />
              <input
                value="5"
                type="radio"
                name="rating"
                checked={filterData.rating === '5'}
                onChange={handleFilterChange('rating')}
                className="mask mask-star-2 bg-orange-400"
              />
            </div>
          </div>
        </li>
        <li className="text-center">
          <label>
            <button
              type="button"
              onClick={handleFilterClick}
              className="btn btn-outline w-full drawer-button gap-2 my-5"
            >
              <FaFilter /> Apply Filters
            </button>
          </label>
          <label
            htmlFor="filter"
            onClick={clearFilters}
            className="btn btn-outline drawer-button gap-2 w-full"
          >
            <FaTrash /> Clear Filters
          </label>
        </li>
      </ul>
    </div>
  );
}
