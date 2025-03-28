const { GoogleGenerativeAI } = require("@google/generative-ai");
const { User } = require('../models/userModel');
const {Comment} = require('../models/commentModel');
const {Like} = require('../models/likeModel');
const Community = require('../models/communityModel');
const Solvedproblems = require('../models/solvedproblemModel');
const {ImpDate} = require('../models/impDatesModel');

const generateUserReport = async (req, res) => {
    try {
        const userId = req.params.userId;
        
        // Fetch user data with populated references
        const user = await User.findById(userId)
            .populate('notesUploaded')
            .populate('notesBought')
            .populate('notesLiked')
            .populate('notesBookMarked')
            .populate('todos')
            .populate('urls');

            console.log('new user', user)

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Fetch all related data
        // const [
        //     comments, 
        //     likes, 
        //     communityPosts,
        //     solvedProblems,
        //     impDates
        // ] = await Promise.all([
        //     Comment.find({ user: userId }).exec(),
        //     Like.find({ user: userId }).exec(),
        //     Community.find({ user: userId }).exec(),
        //     SolvedProblem.find({ user: userId }).exec(),
        //     ImpDate.find({ user: userId }).exec()
        // ]);

        const comments=await Comment.find({ user: userId })
        const likes=await Like.find({ user: userId })
        const communityPosts=await Community.find({ user: userId })
        const solvedProblems=await Solvedproblems.find({ user: userId })
        const impDates=await ImpDate.find({ user: userId })

        // Calculate engagement metrics
        const totalEngagements = comments.length + likes.length + communityPosts.length;
        const notesStats = {
            uploaded: user.notesUploaded?.length || 0,
            bought: user.notesBought?.length || 0,
            liked: user.notesLiked?.length || 0,
            bookmarked: user.notesBookMarked?.length || 0
        };

        // Prepare comprehensive user data
        const userData = {
            // Basic Info
            name: user.username,
            email: user.email,
            githubUsername: user.githubUsername,
            bio: user.Bio,
            department: user.Department,
            year: user.year,
            role: user.role,
            skills: user.skills || [],
            coins: user.coins,
            join_date: user.createdAt,
            
            // Activity Metrics
            total_engagements: totalEngagements,
            notes_stats: notesStats,
            total_comments: comments.length,
            total_likes: likes.length,
            total_community_posts: communityPosts.length,
            total_solved_problems: solvedProblems.length,
            total_important_dates: impDates.length,
            total_todos: user.todos?.length || 0,
            total_saved_urls: user.urls?.length || 0,

            // Recent Activity
            recent_notes: (user.notesUploaded || []).slice(-5).map(note => ({
                title: note.title || 'Untitled',
                subject: note.subject,
                created_at: note.createdAt,
                likes: note.likes?.length || 0
            })),
            recent_community_posts: (communityPosts || []).slice(-3).map(post => ({
                content: post.content,
                created_at: post.createdAt,
                likes: post.likes?.length || 0
            })),
            recent_solved_problems: (solvedProblems || []).slice(-3).map(prob => ({
                title: prob.title || 'Untitled',
                difficulty: prob.difficulty,
                solved_at: prob.createdAt
            })),
            recent_todos: (user.todos || []).slice(-3).map(todo => ({
                title: todo.title || 'Untitled',
                status: todo.completed ? 'Completed' : 'Pending',
                due_date: todo.dueDate
            })),
            recent_urls: (user.urls || []).slice(-3).map(url => ({
                title: url.title || 'Untitled',
                category: url.category,
                saved_at: url.createdAt
            }))
        };

        // Initialize Gemini AI
        const genAI = new GoogleGenerativeAI("AIzaSyAvtYxbcwqMyUUFQInWXtw_ppK_GqaxeXY");
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Generate comprehensive prompt
        const prompt = `
        Please analyze the following user data and create a detailed report in markdown format for a student in an educational platform:

        Personal Profile:
        - Username: ${userData.name}
        - Department: ${userData.department}
        - Year: ${userData.year}
        - Role: ${userData.role}
        - Skills: ${userData.skills.join(', ')}
        - Coins Earned: ${userData.coins}
        - Github: ${userData.githubUsername || 'Not linked'}
        - Join Date: ${userData.join_date}
        
        Academic Engagement Metrics:
        - Notes Created: ${notesStats.uploaded}
        - Notes Purchased: ${notesStats.bought}
        - Notes Liked: ${notesStats.liked}
        - Notes Bookmarked: ${notesStats.bookmarked}
        - Problems Solved: ${userData.total_solved_problems}
        - Important Dates Tracked: ${userData.total_important_dates}
        
        Community Engagement:
        - Total Engagements: ${userData.total_engagements}
        - Comments Made: ${userData.total_comments}
        - Likes Given: ${userData.total_likes}
        - Community Posts: ${userData.total_community_posts}
        
        Productivity Metrics:
        - Active Todos: ${userData.total_todos}
        - Saved Resources: ${userData.total_saved_urls}
        
        Recent Notes Activity:
        ${JSON.stringify(userData.recent_notes, null, 2)}
        
        Recent Community Posts:
        ${JSON.stringify(userData.recent_community_posts, null, 2)}
        
        Recent Problem Solving:
        ${JSON.stringify(userData.recent_solved_problems, null, 2)}
        
        Recent Tasks:
        ${JSON.stringify(userData.recent_todos, null, 2)}
        
        Recent Saved Resources:
        ${JSON.stringify(userData.recent_urls, null, 2)}
        
        Please provide a comprehensive analysis in markdown format including:

        1. Executive Summary
           - Key statistics and highlights
           - Overall engagement score
           - Notable achievements
           - Career readiness index
        
        2. Academic Performance & Learning Style
           - Note creation and consumption patterns
           - Resource utilization analysis
           - Problem-solving progress and approach
           - Study pattern insights
           - Industry-relevant skills gained
        
        3. Community Engagement & Collaboration
           - Interaction frequency and patterns
           - Content contribution quality
           - Peer learning indicators
           - Community impact score
           - Leadership potential
        
        4. Personal Development
           - Skill progression and gaps
           - Time management effectiveness
           - Resource organization habits
           - Learning velocity
           - Professional growth indicators
        
        5. Platform Usage Analysis
           - Feature utilization rates
           - Engagement patterns
           - Coin economy participation
           - Resource access patterns
           - Learning tool effectiveness
        
        6. Key Achievements & Milestones
           - Academic milestones
           - Community contributions
           - Skill acquisitions
           - Notable projects
           - Industry-relevant accomplishments
        
        7. Career Development Path
           - Current skill alignment with industry needs
           - Emerging technology trends in your field
           - Required certifications and qualifications
           - Potential career trajectories
           - Industry-specific opportunities
        
        8. Professional Development Roadmap
           - Technical skills to acquire
           - Soft skills to develop
           - Industry connections to build
           - Projects to undertake
           - Certifications to pursue
        
        9. Personalized Action Plan
           Short-term (3 months):
           - Specific skills to master
           - Projects to complete
           - Community contributions to make
           - Learning milestones to achieve
           - Industry events to participate in
        
           Medium-term (6-12 months):
           - Advanced skills to develop
           - Leadership roles to pursue
           - Portfolio projects to build
           - Professional network expansion
           - Industry certifications to obtain
        
           Long-term (1-2 years):
           - Career specialization path
           - Industry position targeting
           - Professional brand building
           - Expert-level skill development
           - Leadership development goals
        
        10. Industry Success Strategies
            - Networking opportunities in your field
            - Industry mentorship programs
            - Professional organizations to join
            - Conference and workshop participation
            - Online presence development
        
        11. Resource Recommendations
            - Industry-specific learning platforms
            - Professional development tools
            - Networking platforms
            - Technical documentation
            - Career development resources
        
        12. Progress Tracking Framework
            - Key performance indicators
            - Skill assessment metrics
            - Project completion milestones
            - Professional growth benchmarks
            - Career progression checkpoints

        Format the response in clean markdown with appropriate headers, bullet points, and sections for easy reading and display. Focus on providing actionable insights and specific steps for career development in the user's field.`;

        // Generate report using Gemini AI
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return res.status(200).json({
            success: true,
            report: {
                content: text,
                userData: userData
            }
        });
    } catch (error) {
        console.error('Error generating report:', error);
        return res.status(500).json({
            success: false,
            message: "Error generating report",
            error: error.message
        });
    }
};

module.exports = {
    generateUserReport
};
