import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { getLogedinUser } from "../redux/auth/authActions";
import { editProfile, getUserSkills, addSkills, removeSkills } from "../redux/user/userActions";
import { useState } from 'react';
import { AiOutlineDelete } from 'react-icons/ai';




const Skills = () => {
    const dispatch = useDispatch();
    const [SkillsInput, setSkillsInput] = useState(false);
    const [skill, setSkill] = useState('')

    const skills = useSelector((state) => state.user.user.skills);


    const handleSubmit = async (e) => {
        e.preventDefault();
        await dispatch(addSkills(skill)).then(async () => {
            await dispatch(getUserSkills())
        })
        setSkill('')
        setSkillsInput(false)
    }

    useEffect(() => {
        dispatch(getUserSkills())
    }, [dispatch])


    return (
        <form className="max-w-md mx-auto bg-white rounded-xl overflow-hidden md:max-w-2xl mt-16 p-8" >
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Skills:
                </label>
                <div className="flex flex-wrap">
                    {skills?.map((skill, index) => (
                        <div
                            key={index}
                            className="bg-blue-100 text-blue-700 px-3 py-2 rounded-full m-1 flex gap-2"
                        >
                            {skill}
                            <span className="mt-1"
                                onClick={() => {
                                    dispatch(removeSkills(skill))
                                    dispatch(getUserSkills())
                                }
                                }
                            ><AiOutlineDelete /></span>
                        </div>
                    ))}
                    <div
                        className={`flex items-center ${SkillsInput ? 'bg-red-100' : 'bg-blue-100'} text-blue-700 px-3 py-2 rounded-full m-1 hover:bg-blue-200 cursor-pointer`}
                        onClick={() => {
                            setSkillsInput(!SkillsInput);
                        }}
                    >
                        {SkillsInput ? <span>&#10006;</span> : <span className="mr-2">&#43;</span>}
                    </div>

                </div>

                {SkillsInput ? (
                    <div className="flex flex-wrap">
                        <input
                            type="text"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline m-1"
                            placeholder="Add Skills with a comma"
                            name="skills"
                            value={skill}
                            onChange={(e) => {
                                setSkill(e.target.value)
                            }}
                        />
                        <button
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mr-2"
                            type="button"
                            onClick={handleSubmit}
                        >
                            Add
                        </button>
                    </div>
                ) : null}


            </div>
        </form>
    )
}

export default Skills
