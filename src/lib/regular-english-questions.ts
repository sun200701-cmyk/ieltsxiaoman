import type { DemoQuestion } from "@/lib/types";

export type RegularEnglishQuestion = DemoQuestion & {
  categoryId: string;
  categorySlug: string;
  categoryTitle: string;
  sortOrder: number;
};

export type RegularEnglishCategory = {
  id: string;
  slug: string;
  title: string;
  questionCount: number;
};

export const regularEnglishQuestions: RegularEnglishQuestion[] = [
  {
    "id": "regular-01-01",
    "slug": "regular-01-01",
    "title": "自我介绍 Q1",
    "part": "Part 1",
    "prompt": "Please introduce yourself.",
    "followUps": [],
    "tags": [
      "口语素养",
      "自我介绍"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Hello everyone. My name is Deepak, and I am currently a university student majoring in Robotics Engineering. I am a curious and hardworking person, and I enjoy learning new things, especially in technology and artificial intelligence. In my free time, I like listening to music, watching videos, and chatting with friends. I believe I am open-minded and willing to improve myself. In the future, I hope to develop both my professional skills and my communication skills so that I can become a more confident and capable person.",
    "sectionLabel": "自我介绍",
    "isRequired": false,
    "categoryId": "regular-category-01",
    "categorySlug": "category-01",
    "categoryTitle": "自我介绍",
    "sortOrder": 1
  },
  {
    "id": "regular-01-02",
    "slug": "regular-01-02",
    "title": "自我介绍 Q2",
    "part": "Part 1",
    "prompt": "What kind of person do you think you are?",
    "followUps": [],
    "tags": [
      "口语素养",
      "自我介绍"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "I think I am a responsible and adaptable person. When I face a new environment or a difficult task, I usually try to stay calm and find a solution step by step. I am also quite curious, so I enjoy exploring new knowledge and ideas. At the same time, I know I still have many things to improve, especially in communication and time management. Overall, I would say I am someone who is willing to learn, work hard, and become better over time.",
    "sectionLabel": "自我介绍",
    "isRequired": false,
    "categoryId": "regular-category-01",
    "categorySlug": "category-01",
    "categoryTitle": "自我介绍",
    "sortOrder": 2
  },
  {
    "id": "regular-01-03",
    "slug": "regular-01-03",
    "title": "自我介绍 Q3",
    "part": "Part 1",
    "prompt": "Please talk about your strengths and weaknesses.",
    "followUps": [],
    "tags": [
      "口语素养",
      "自我介绍"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "One of my strengths is that I am patient when solving problems. If I do not understand something, I am willing to spend time studying it until I figure it out. Another strength is that I can adapt to new situations quite quickly. However, I also have weaknesses. For example, sometimes I overthink things and put too much pressure on myself. I also feel that I should become more confident when speaking in public. I believe that knowing both my strengths and weaknesses helps me improve in a more realistic way.",
    "sectionLabel": "自我介绍",
    "isRequired": false,
    "categoryId": "regular-category-01",
    "categorySlug": "category-01",
    "categoryTitle": "自我介绍",
    "sortOrder": 3
  },
  {
    "id": "regular-01-04",
    "slug": "regular-01-04",
    "title": "自我介绍 Q4",
    "part": "Part 1",
    "prompt": "How would you describe yourself to a new classmate?",
    "followUps": [],
    "tags": [
      "口语素养",
      "自我介绍"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "If I met a new classmate, I would describe myself as friendly, serious about study, and easy to get along with. I may not be the most outgoing person at first, but once I become familiar with people, I enjoy having conversations and sharing ideas. I take my academic work seriously, but I also think it is important to relax and enjoy university life. I would probably say that I am someone who values honesty, respect, and personal growth.",
    "sectionLabel": "自我介绍",
    "isRequired": false,
    "categoryId": "regular-category-01",
    "categorySlug": "category-01",
    "categoryTitle": "自我介绍",
    "sortOrder": 4
  },
  {
    "id": "regular-01-05",
    "slug": "regular-01-05",
    "title": "自我介绍 Q5",
    "part": "Part 1",
    "prompt": "What makes you different from other people?",
    "followUps": [],
    "tags": [
      "口语素养",
      "自我介绍"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "I think what makes me different is my strong interest in combining technology with real-life problem solving. I do not only want to learn knowledge from textbooks, but I also want to understand how to apply it in practical situations. Besides that, I often reflect on my own progress and think about how I can improve myself. I believe everyone has unique qualities, and for me, one important quality is my willingness to keep learning and changing.",
    "sectionLabel": "自我介绍",
    "isRequired": false,
    "categoryId": "regular-category-01",
    "categorySlug": "category-01",
    "categoryTitle": "自我介绍",
    "sortOrder": 5
  },
  {
    "id": "regular-02-01",
    "slug": "regular-02-01",
    "title": "家庭朋友 Q1",
    "part": "Part 1",
    "prompt": "Please talk about your family.",
    "followUps": [],
    "tags": [
      "口语素养",
      "家庭朋友"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "My family is very important to me because they always support me in different stages of my life. Although everyone in my family is busy with work or study, we still try to care about each other and spend time together whenever possible. My family has taught me many valuable things, such as responsibility, patience, and kindness. Whenever I face difficulties, they encourage me and give me emotional support. I feel lucky to have such a warm and supportive family.",
    "sectionLabel": "家庭朋友",
    "isRequired": false,
    "categoryId": "regular-category-02",
    "categorySlug": "category-02",
    "categoryTitle": "家庭朋友",
    "sortOrder": 1
  },
  {
    "id": "regular-02-02",
    "slug": "regular-02-02",
    "title": "家庭朋友 Q2",
    "part": "Part 1",
    "prompt": "Who are you closest to in your family, and why?",
    "followUps": [],
    "tags": [
      "口语素养",
      "家庭朋友"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "I think I am closest to one of my family members because this person understands me very well and always listens to me patiently. When I feel stressed or confused, I can share my thoughts without worrying about being judged. This kind of trust is very important to me. I also learn a lot from this person’s attitude toward life, especially the ability to stay calm and positive in difficult situations. That is why our relationship means so much to me.",
    "sectionLabel": "家庭朋友",
    "isRequired": false,
    "categoryId": "regular-category-02",
    "categorySlug": "category-02",
    "categoryTitle": "家庭朋友",
    "sortOrder": 2
  },
  {
    "id": "regular-02-03",
    "slug": "regular-02-03",
    "title": "家庭朋友 Q3",
    "part": "Part 1",
    "prompt": "Please describe one of your close friends.",
    "followUps": [],
    "tags": [
      "口语素养",
      "家庭朋友"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "One of my close friends is someone who is honest, supportive, and easy to talk to. We became friends because we shared similar interests and could understand each other well. What I value most is that this friend always encourages me when I feel uncertain about myself. At the same time, we can also have fun together and share many memorable experiences. In my opinion, a good friend is not only someone to spend time with, but also someone who helps you grow.",
    "sectionLabel": "家庭朋友",
    "isRequired": false,
    "categoryId": "regular-category-02",
    "categorySlug": "category-02",
    "categoryTitle": "家庭朋友",
    "sortOrder": 3
  },
  {
    "id": "regular-02-04",
    "slug": "regular-02-04",
    "title": "家庭朋友 Q4",
    "part": "Part 1",
    "prompt": "What qualities do you think are important in friendship?",
    "followUps": [],
    "tags": [
      "口语素养",
      "家庭朋友"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "I think the most important qualities in friendship are trust, honesty, and mutual respect. Without trust, it is difficult to build a strong relationship. Honesty is also necessary because true friends should be able to share their real thoughts and feelings. In addition, respect matters a lot, especially when people have different opinions or lifestyles. A healthy friendship should make both people feel comfortable, supported, and understood.",
    "sectionLabel": "家庭朋友",
    "isRequired": false,
    "categoryId": "regular-category-02",
    "categorySlug": "category-02",
    "categoryTitle": "家庭朋友",
    "sortOrder": 4
  },
  {
    "id": "regular-02-05",
    "slug": "regular-02-05",
    "title": "家庭朋友 Q5",
    "part": "Part 1",
    "prompt": "Do family and friends influence your life? How?",
    "followUps": [],
    "tags": [
      "口语素养",
      "家庭朋友"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Yes, family and friends influence my life in many ways. My family shapes my values and gives me a sense of support, while my friends affect my daily mood and social experiences. They can encourage me when I feel stressed, and sometimes they also give me useful advice. Being around positive people helps me stay motivated and become a better person. I think the people around us have a big impact on our growth and our way of thinking.",
    "sectionLabel": "家庭朋友",
    "isRequired": false,
    "categoryId": "regular-category-02",
    "categorySlug": "category-02",
    "categoryTitle": "家庭朋友",
    "sortOrder": 5
  },
  {
    "id": "regular-03-01",
    "slug": "regular-03-01",
    "title": "学校生活 Q1",
    "part": "Part 1",
    "prompt": "Please describe your school life.",
    "followUps": [],
    "tags": [
      "口语素养",
      "学校生活"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "My school life is quite busy but also meaningful. On weekdays, I usually attend classes, finish assignments, and review what I have learned. Besides academic work, I also spend time with classmates, take part in discussions, and sometimes join campus activities. University life has taught me not only subject knowledge but also how to manage my time and communicate with others. Although there is pressure sometimes, I think these challenges help me grow.",
    "sectionLabel": "学校生活",
    "isRequired": false,
    "categoryId": "regular-category-03",
    "categorySlug": "category-03",
    "categoryTitle": "学校生活",
    "sortOrder": 1
  },
  {
    "id": "regular-03-02",
    "slug": "regular-03-02",
    "title": "学校生活 Q2",
    "part": "Part 1",
    "prompt": "What do you usually do on a normal school day?",
    "followUps": [],
    "tags": [
      "口语素养",
      "学校生活"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "On a normal school day, I usually start by going to class in the morning. After class, I may spend some time reviewing notes, doing homework, or preparing for the next lesson. During breaks, I often talk with classmates or have meals with friends. In the evening, I may continue studying, exercise a little, or relax by listening to music. My daily schedule is not always easy, but I try to keep a balance between study and rest.",
    "sectionLabel": "学校生活",
    "isRequired": false,
    "categoryId": "regular-category-03",
    "categorySlug": "category-03",
    "categoryTitle": "学校生活",
    "sortOrder": 2
  },
  {
    "id": "regular-03-03",
    "slug": "regular-03-03",
    "title": "学校生活 Q3",
    "part": "Part 1",
    "prompt": "What do you like most about university life?",
    "followUps": [],
    "tags": [
      "口语素养",
      "学校生活"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "What I like most about university life is the opportunity to grow independently. Compared with earlier stages of education, university gives students more freedom and more responsibility. We can choose how to arrange our time, what activities to join, and how to improve ourselves. I also enjoy meeting different people and being exposed to new ideas. For me, university is not only a place to gain knowledge, but also an important stage of personal development.",
    "sectionLabel": "学校生活",
    "isRequired": false,
    "categoryId": "regular-category-03",
    "categorySlug": "category-03",
    "categoryTitle": "学校生活",
    "sortOrder": 3
  },
  {
    "id": "regular-03-04",
    "slug": "regular-03-04",
    "title": "学校生活 Q4",
    "part": "Part 1",
    "prompt": "What challenges do students often face at school?",
    "followUps": [],
    "tags": [
      "口语素养",
      "学校生活"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Students often face challenges such as heavy coursework, exam pressure, and time management problems. Some students may also feel stressed because they need to adapt to a new environment or deal with social relationships. In addition, balancing study, rest, and personal interests is not always easy. However, I believe these challenges are a natural part of school life. If students learn to stay organized and ask for help when necessary, they can handle these difficulties better.",
    "sectionLabel": "学校生活",
    "isRequired": false,
    "categoryId": "regular-category-03",
    "categorySlug": "category-03",
    "categoryTitle": "学校生活",
    "sortOrder": 4
  },
  {
    "id": "regular-03-05",
    "slug": "regular-03-05",
    "title": "学校生活 Q5",
    "part": "Part 1",
    "prompt": "How has school life changed you?",
    "followUps": [],
    "tags": [
      "口语素养",
      "学校生活"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "School life has changed me in many positive ways. It has made me more independent, more disciplined, and more aware of my future goals. Through study and communication with others, I have learned how to think more carefully and express my ideas more clearly. I have also realized the importance of responsibility and self-management. Although school life can be stressful, it has helped me become more mature and prepared for future challenges.",
    "sectionLabel": "学校生活",
    "isRequired": false,
    "categoryId": "regular-category-03",
    "categorySlug": "category-03",
    "categoryTitle": "学校生活",
    "sortOrder": 5
  },
  {
    "id": "regular-04-01",
    "slug": "regular-04-01",
    "title": "专业学习 Q1",
    "part": "Part 1",
    "prompt": "Why did you choose your major?",
    "followUps": [],
    "tags": [
      "口语素养",
      "专业学习"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "I chose my major because I have always been interested in technology and intelligent systems. Robotics Engineering is exciting because it combines mechanics, electronics, programming, and artificial intelligence. I feel that this field has great potential in the future and can be applied in many industries. More importantly, I want to learn knowledge that can solve practical problems in real life. That is why I decided to study this major.",
    "sectionLabel": "专业学习",
    "isRequired": false,
    "categoryId": "regular-category-04",
    "categorySlug": "category-04",
    "categoryTitle": "专业学习",
    "sortOrder": 1
  },
  {
    "id": "regular-04-02",
    "slug": "regular-04-02",
    "title": "专业学习 Q2",
    "part": "Part 1",
    "prompt": "What have you learned from your major?",
    "followUps": [],
    "tags": [
      "口语素养",
      "专业学习"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "My major has taught me both theoretical knowledge and practical skills. I have learned about engineering principles, programming, and how intelligent systems work in real applications. Besides academic knowledge, I have also improved my logical thinking and problem-solving ability. Some courses are difficult, but they train me to be more patient and careful. I believe these experiences are very valuable for my future development.",
    "sectionLabel": "专业学习",
    "isRequired": false,
    "categoryId": "regular-category-04",
    "categorySlug": "category-04",
    "categoryTitle": "专业学习",
    "sortOrder": 2
  },
  {
    "id": "regular-04-03",
    "slug": "regular-04-03",
    "title": "专业学习 Q3",
    "part": "Part 1",
    "prompt": "What course in your major do you like most?",
    "followUps": [],
    "tags": [
      "口语素养",
      "专业学习"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "One course I like most is a course related to programming or intelligent systems, because it allows me to combine theory with practice. I enjoy it because I can see how abstract concepts are turned into real functions or results. This kind of learning feels meaningful and motivates me to explore more deeply. Although the course can be challenging, I think it is rewarding because it helps me understand my major better.",
    "sectionLabel": "专业学习",
    "isRequired": false,
    "categoryId": "regular-category-04",
    "categorySlug": "category-04",
    "categoryTitle": "专业学习",
    "sortOrder": 3
  },
  {
    "id": "regular-04-04",
    "slug": "regular-04-04",
    "title": "专业学习 Q4",
    "part": "Part 1",
    "prompt": "Is your major difficult? Why or why not?",
    "followUps": [],
    "tags": [
      "口语素养",
      "专业学习"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Yes, I think my major is challenging because it requires both theoretical understanding and practical application. Students need to learn different subjects and connect them together, which is not always easy. Some courses involve complicated concepts, and some tasks take a lot of time to complete. However, I do not think difficulty is a bad thing. In fact, these challenges make the learning process more meaningful and help students become stronger.",
    "sectionLabel": "专业学习",
    "isRequired": false,
    "categoryId": "regular-category-04",
    "categorySlug": "category-04",
    "categoryTitle": "专业学习",
    "sortOrder": 4
  },
  {
    "id": "regular-04-05",
    "slug": "regular-04-05",
    "title": "专业学习 Q5",
    "part": "Part 1",
    "prompt": "How will your major help your future career?",
    "followUps": [],
    "tags": [
      "口语素养",
      "专业学习"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "My major will help my future career by giving me professional knowledge and practical skills in a growing field. It prepares me to work in areas related to robotics, automation, or artificial intelligence. At the same time, it helps me develop abilities such as logical thinking, teamwork, and problem solving, which are useful in many jobs. I believe my major provides a solid foundation for both employment and long-term growth.",
    "sectionLabel": "专业学习",
    "isRequired": false,
    "categoryId": "regular-category-04",
    "categorySlug": "category-04",
    "categoryTitle": "专业学习",
    "sortOrder": 5
  },
  {
    "id": "regular-05-01",
    "slug": "regular-05-01",
    "title": "兴趣爱好 Q1",
    "part": "Part 1",
    "prompt": "Please talk about one of your hobbies.",
    "followUps": [],
    "tags": [
      "口语素养",
      "兴趣爱好"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "One of my favorite hobbies is listening to music. I enjoy music because it helps me relax and improve my mood, especially after a long day of study. Different kinds of music can create different feelings. Soft music helps me calm down, while energetic music makes me feel more motivated. In my opinion, hobbies are important because they give us balance in life and reduce stress.",
    "sectionLabel": "兴趣爱好",
    "isRequired": false,
    "categoryId": "regular-category-05",
    "categorySlug": "category-05",
    "categoryTitle": "兴趣爱好",
    "sortOrder": 1
  },
  {
    "id": "regular-05-02",
    "slug": "regular-05-02",
    "title": "兴趣爱好 Q2",
    "part": "Part 1",
    "prompt": "Why are hobbies important for students?",
    "followUps": [],
    "tags": [
      "口语素养",
      "兴趣爱好"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "I think hobbies are important for students because they provide a healthy way to relax and recharge. Academic life can be stressful, so having a hobby helps students reduce pressure and keep a better mental state. Hobbies can also help people discover their interests and improve certain skills. For example, sports can improve physical health, and reading can broaden knowledge. A good hobby makes life more meaningful and balanced.",
    "sectionLabel": "兴趣爱好",
    "isRequired": false,
    "categoryId": "regular-category-05",
    "categorySlug": "category-05",
    "categoryTitle": "兴趣爱好",
    "sortOrder": 2
  },
  {
    "id": "regular-05-03",
    "slug": "regular-05-03",
    "title": "兴趣爱好 Q3",
    "part": "Part 1",
    "prompt": "How do you usually spend your free time?",
    "followUps": [],
    "tags": [
      "口语素养",
      "兴趣爱好"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "In my free time, I usually do things that help me relax and enjoy myself. For example, I may listen to music, watch videos, go for a walk, or chat with friends. Sometimes I also use my free time to learn something new or think about my future goals. I believe free time is valuable because it allows us to recover from stress and keep a good balance between work and rest.",
    "sectionLabel": "兴趣爱好",
    "isRequired": false,
    "categoryId": "regular-category-05",
    "categorySlug": "category-05",
    "categoryTitle": "兴趣爱好",
    "sortOrder": 3
  },
  {
    "id": "regular-05-04",
    "slug": "regular-05-04",
    "title": "兴趣爱好 Q4",
    "part": "Part 1",
    "prompt": "Have your hobbies changed over time?",
    "followUps": [],
    "tags": [
      "口语素养",
      "兴趣爱好"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Yes, my hobbies have changed over time. When I was younger, I was more interested in simple entertainment, but now I pay more attention to hobbies that help me relax or improve myself. This change may be related to age, academic pressure, and personal growth. I think it is natural for hobbies to change because our interests and needs also change as we gain new experiences.",
    "sectionLabel": "兴趣爱好",
    "isRequired": false,
    "categoryId": "regular-category-05",
    "categorySlug": "category-05",
    "categoryTitle": "兴趣爱好",
    "sortOrder": 4
  },
  {
    "id": "regular-05-05",
    "slug": "regular-05-05",
    "title": "兴趣爱好 Q5",
    "part": "Part 1",
    "prompt": "Would you like to develop a new hobby in the future?",
    "followUps": [],
    "tags": [
      "口语素养",
      "兴趣爱好"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Yes, I would like to develop a new hobby in the future, especially something that can enrich my life and improve my abilities. For example, I may want to learn a musical instrument, improve my fitness, or explore photography. I think trying a new hobby is a good way to challenge yourself and discover new possibilities. It can also make daily life more interesting.",
    "sectionLabel": "兴趣爱好",
    "isRequired": false,
    "categoryId": "regular-category-05",
    "categorySlug": "category-05",
    "categoryTitle": "兴趣爱好",
    "sortOrder": 5
  },
  {
    "id": "regular-06-01",
    "slug": "regular-06-01",
    "title": "旅游经历 Q1",
    "part": "Part 1",
    "prompt": "Please describe a trip that you enjoyed.",
    "followUps": [],
    "tags": [
      "口语素养",
      "旅游经历"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "One memorable trip I had was a journey to another city with my friends. We planned the trip in advance and visited several interesting places. During the trip, we tried local food, enjoyed the scenery, and took many photos. What I liked most was not only the places themselves, but also the experience of traveling with people I enjoyed being with. I think travel is meaningful because it broadens our minds and creates unforgettable memories.",
    "sectionLabel": "旅游经历",
    "isRequired": false,
    "categoryId": "regular-category-06",
    "categorySlug": "category-06",
    "categoryTitle": "旅游经历",
    "sortOrder": 1
  },
  {
    "id": "regular-06-02",
    "slug": "regular-06-02",
    "title": "旅游经历 Q2",
    "part": "Part 1",
    "prompt": "Why do people like traveling?",
    "followUps": [],
    "tags": [
      "口语素养",
      "旅游经历"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "I think people like traveling because it allows them to leave their daily routine and experience something new. Traveling gives people the chance to see different scenery, learn about local culture, and meet different kinds of people. It can also be a way to relax and reduce stress. In addition, travel often creates memorable experiences that stay with us for a long time.",
    "sectionLabel": "旅游经历",
    "isRequired": false,
    "categoryId": "regular-category-06",
    "categorySlug": "category-06",
    "categoryTitle": "旅游经历",
    "sortOrder": 2
  },
  {
    "id": "regular-06-03",
    "slug": "regular-06-03",
    "title": "旅游经历 Q3",
    "part": "Part 1",
    "prompt": "Do you prefer traveling alone or with others?",
    "followUps": [],
    "tags": [
      "口语素养",
      "旅游经历"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "I prefer traveling with others because it is more enjoyable and memorable to share experiences with friends or family. When traveling together, people can help each other, discuss plans, and enjoy conversations during the trip. At the same time, traveling with others often feels safer and more lively. However, I also understand that traveling alone can provide more freedom and personal reflection.",
    "sectionLabel": "旅游经历",
    "isRequired": false,
    "categoryId": "regular-category-06",
    "categorySlug": "category-06",
    "categoryTitle": "旅游经历",
    "sortOrder": 3
  },
  {
    "id": "regular-06-04",
    "slug": "regular-06-04",
    "title": "旅游经历 Q4",
    "part": "Part 1",
    "prompt": "What can people learn from traveling?",
    "followUps": [],
    "tags": [
      "口语素养",
      "旅游经历"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "People can learn many things from traveling. First, they can learn about different cultures, customs, and lifestyles. Second, travel teaches people how to adapt to new environments and solve unexpected problems. Third, it helps people become more open-minded because they see that the world is much bigger and more diverse than their daily surroundings. In my opinion, travel is both enjoyable and educational.",
    "sectionLabel": "旅游经历",
    "isRequired": false,
    "categoryId": "regular-category-06",
    "categorySlug": "category-06",
    "categoryTitle": "旅游经历",
    "sortOrder": 4
  },
  {
    "id": "regular-06-05",
    "slug": "regular-06-05",
    "title": "旅游经历 Q5",
    "part": "Part 1",
    "prompt": "What is the most important thing when planning a trip?",
    "followUps": [],
    "tags": [
      "口语素养",
      "旅游经历"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "I think the most important thing when planning a trip is preparation. People should think carefully about transportation, accommodation, budget, and safety before they leave. A clear plan can help avoid unnecessary stress and make the journey smoother. At the same time, I believe it is also important to stay flexible, because unexpected things can always happen during a trip.",
    "sectionLabel": "旅游经历",
    "isRequired": false,
    "categoryId": "regular-category-06",
    "categorySlug": "category-06",
    "categoryTitle": "旅游经历",
    "sortOrder": 5
  },
  {
    "id": "regular-07-01",
    "slug": "regular-07-01",
    "title": "食物与健康 Q1",
    "part": "Part 1",
    "prompt": "What is the relationship between food and health?",
    "followUps": [],
    "tags": [
      "口语素养",
      "食物与健康"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "I believe food and health are closely connected. A balanced diet provides energy and nutrients, while unhealthy eating habits may cause problems such as fatigue or illness. Many students rely too much on fast food because it is convenient, but this is not a good long-term choice. In my opinion, good health starts with healthy eating, together with enough sleep and regular exercise.",
    "sectionLabel": "食物与健康",
    "isRequired": false,
    "categoryId": "regular-category-07",
    "categorySlug": "category-07",
    "categoryTitle": "食物与健康",
    "sortOrder": 1
  },
  {
    "id": "regular-07-02",
    "slug": "regular-07-02",
    "title": "食物与健康 Q2",
    "part": "Part 1",
    "prompt": "Do you think students have healthy eating habits?",
    "followUps": [],
    "tags": [
      "口语素养",
      "食物与健康"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "I do not think all students have healthy eating habits. Many students skip breakfast, eat too much fast food, or drink too many sugary beverages because of their busy schedules. These habits may save time in the short term, but they can affect energy levels and overall health. I think students should pay more attention to nutrition and try to make better choices in daily life.",
    "sectionLabel": "食物与健康",
    "isRequired": false,
    "categoryId": "regular-category-07",
    "categorySlug": "category-07",
    "categoryTitle": "食物与健康",
    "sortOrder": 2
  },
  {
    "id": "regular-07-03",
    "slug": "regular-07-03",
    "title": "食物与健康 Q3",
    "part": "Part 1",
    "prompt": "What should people do to stay healthy?",
    "followUps": [],
    "tags": [
      "口语素养",
      "食物与健康"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "To stay healthy, people should develop good habits in several areas. First, they should eat a balanced diet with enough vegetables, fruits, and protein. Second, they need regular exercise to keep their bodies strong. Third, getting enough sleep is very important because it affects both physical and mental health. Finally, people should try to manage stress in a healthy way. Health is the result of many small habits combined together.",
    "sectionLabel": "食物与健康",
    "isRequired": false,
    "categoryId": "regular-category-07",
    "categorySlug": "category-07",
    "categoryTitle": "食物与健康",
    "sortOrder": 3
  },
  {
    "id": "regular-07-04",
    "slug": "regular-07-04",
    "title": "食物与健康 Q4",
    "part": "Part 1",
    "prompt": "Is it important to cook at home? Why?",
    "followUps": [],
    "tags": [
      "口语素养",
      "食物与健康"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Yes, I think cooking at home is important because it is usually healthier and more economical than eating outside all the time. When people cook for themselves, they can control the ingredients, oil, and sugar more easily. Home cooking can also help people develop useful life skills and build healthier habits. Although it takes time, I think it is a valuable habit for long-term health.",
    "sectionLabel": "食物与健康",
    "isRequired": false,
    "categoryId": "regular-category-07",
    "categorySlug": "category-07",
    "categoryTitle": "食物与健康",
    "sortOrder": 4
  },
  {
    "id": "regular-07-05",
    "slug": "regular-07-05",
    "title": "食物与健康 Q5",
    "part": "Part 1",
    "prompt": "How does exercise influence health?",
    "followUps": [],
    "tags": [
      "口语素养",
      "食物与健康"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Exercise has a very positive influence on health. It helps people maintain a healthy body weight, improve physical strength, and reduce the risk of some diseases. In addition, exercise is good for mental health because it can reduce stress and improve mood. For students especially, regular exercise can also increase energy and concentration. I think exercise is one of the most effective ways to improve overall well-being.",
    "sectionLabel": "食物与健康",
    "isRequired": false,
    "categoryId": "regular-category-07",
    "categorySlug": "category-07",
    "categoryTitle": "食物与健康",
    "sortOrder": 5
  },
  {
    "id": "regular-08-01",
    "slug": "regular-08-01",
    "title": "科技与AI Q1",
    "part": "Part 1",
    "prompt": "How are technology and AI changing our lives?",
    "followUps": [],
    "tags": [
      "口语素养",
      "科技与AI"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Technology and artificial intelligence are changing our lives in many ways. They make work and study more efficient, and they help people complete tasks more quickly. For example, AI can assist with translation, writing, data analysis, and personalized learning. In daily life, smart devices and apps make communication, shopping, and transportation more convenient. However, people also need to think carefully about privacy and overdependence.",
    "sectionLabel": "科技与AI",
    "isRequired": false,
    "categoryId": "regular-category-08",
    "categorySlug": "category-08",
    "categoryTitle": "科技与AI",
    "sortOrder": 1
  },
  {
    "id": "regular-08-02",
    "slug": "regular-08-02",
    "title": "科技与AI Q2",
    "part": "Part 1",
    "prompt": "What are the benefits of AI in education?",
    "followUps": [],
    "tags": [
      "口语素养",
      "科技与AI"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "AI brings many benefits to education. It can provide personalized learning support based on students’ different needs and abilities. It can also help students find information more quickly and improve their study efficiency. For teachers, AI may reduce repetitive work and make teaching more flexible. In my opinion, if it is used properly, AI can become a very helpful tool in the learning process.",
    "sectionLabel": "科技与AI",
    "isRequired": false,
    "categoryId": "regular-category-08",
    "categorySlug": "category-08",
    "categoryTitle": "科技与AI",
    "sortOrder": 2
  },
  {
    "id": "regular-08-03",
    "slug": "regular-08-03",
    "title": "科技与AI Q3",
    "part": "Part 1",
    "prompt": "Do you think AI will replace some jobs?",
    "followUps": [],
    "tags": [
      "口语素养",
      "科技与AI"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Yes, I think AI will replace some jobs, especially repetitive and routine tasks. Machines and intelligent systems can often do these tasks faster and more accurately. However, I do not believe AI will replace all jobs. Many roles still require creativity, emotional understanding, decision making, and human communication. I think the future will be more about cooperation between humans and AI rather than total replacement.",
    "sectionLabel": "科技与AI",
    "isRequired": false,
    "categoryId": "regular-category-08",
    "categorySlug": "category-08",
    "categoryTitle": "科技与AI",
    "sortOrder": 3
  },
  {
    "id": "regular-08-04",
    "slug": "regular-08-04",
    "title": "科技与AI Q4",
    "part": "Part 1",
    "prompt": "What are the risks of depending too much on technology?",
    "followUps": [],
    "tags": [
      "口语素养",
      "科技与AI"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Depending too much on technology can create several problems. People may become less independent in thinking and problem solving if they rely on digital tools for everything. There are also concerns about privacy, data security, and misinformation. In addition, spending too much time with devices may reduce face-to-face communication and affect mental health. That is why I think technology should be used wisely and in moderation.",
    "sectionLabel": "科技与AI",
    "isRequired": false,
    "categoryId": "regular-category-08",
    "categorySlug": "category-08",
    "categoryTitle": "科技与AI",
    "sortOrder": 4
  },
  {
    "id": "regular-08-05",
    "slug": "regular-08-05",
    "title": "科技与AI Q5",
    "part": "Part 1",
    "prompt": "How can students use AI responsibly?",
    "followUps": [],
    "tags": [
      "口语素养",
      "科技与AI"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Students can use AI responsibly by treating it as a tool for support rather than a shortcut for avoiding learning. For example, they can use AI to explain difficult concepts, improve language skills, or organize ideas, but they should still think independently and complete tasks honestly. It is also important to check information carefully instead of accepting every answer without question. Responsible use of AI means combining efficiency with critical thinking.",
    "sectionLabel": "科技与AI",
    "isRequired": false,
    "categoryId": "regular-category-08",
    "categorySlug": "category-08",
    "categoryTitle": "科技与AI",
    "sortOrder": 5
  },
  {
    "id": "regular-09-01",
    "slug": "regular-09-01",
    "title": "环境保护 Q1",
    "part": "Part 1",
    "prompt": "What can university students do to protect the environment?",
    "followUps": [],
    "tags": [
      "口语素养",
      "环境保护"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "University students can do many practical things to protect the environment. They can save water and electricity, reduce waste, and use reusable items instead of disposable products. Students can also choose greener transportation, such as walking, cycling, or taking public transport. In addition, they can join environmental activities and encourage others to take action. Small actions may seem simple, but together they can make a big difference.",
    "sectionLabel": "环境保护",
    "isRequired": false,
    "categoryId": "regular-category-09",
    "categorySlug": "category-09",
    "categoryTitle": "环境保护",
    "sortOrder": 1
  },
  {
    "id": "regular-09-02",
    "slug": "regular-09-02",
    "title": "环境保护 Q2",
    "part": "Part 1",
    "prompt": "Why is environmental protection important?",
    "followUps": [],
    "tags": [
      "口语素养",
      "环境保护"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Environmental protection is important because the natural environment directly affects human life and future development. Problems such as pollution, climate change, and resource waste can harm both people and ecosystems. If we do not take action now, future generations may face even more serious challenges. Protecting the environment is not only about nature, but also about protecting our own living conditions.",
    "sectionLabel": "环境保护",
    "isRequired": false,
    "categoryId": "regular-category-09",
    "categorySlug": "category-09",
    "categoryTitle": "环境保护",
    "sortOrder": 2
  },
  {
    "id": "regular-09-03",
    "slug": "regular-09-03",
    "title": "环境保护 Q3",
    "part": "Part 1",
    "prompt": "What environmental problems do you notice in daily life?",
    "followUps": [],
    "tags": [
      "口语素养",
      "环境保护"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "In daily life, I often notice problems such as plastic waste, food waste, and unnecessary use of electricity. Sometimes people leave lights on when they are not needed, or they use too many disposable products for convenience. These may seem like small issues, but they reflect larger habits that affect the environment. I think awareness is the first step toward change.",
    "sectionLabel": "环境保护",
    "isRequired": false,
    "categoryId": "regular-category-09",
    "categorySlug": "category-09",
    "categoryTitle": "环境保护",
    "sortOrder": 3
  },
  {
    "id": "regular-09-04",
    "slug": "regular-09-04",
    "title": "环境保护 Q4",
    "part": "Part 1",
    "prompt": "Should schools do more to teach environmental awareness?",
    "followUps": [],
    "tags": [
      "口语素养",
      "环境保护"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Yes, I think schools should do more to teach environmental awareness. Education is one of the best ways to help young people develop responsible habits. Schools can organize lectures, campaigns, and practical activities such as recycling programs or clean-up events. When students understand environmental issues more clearly, they are more likely to take action in daily life.",
    "sectionLabel": "环境保护",
    "isRequired": false,
    "categoryId": "regular-category-09",
    "categorySlug": "category-09",
    "categoryTitle": "环境保护",
    "sortOrder": 4
  },
  {
    "id": "regular-09-05",
    "slug": "regular-09-05",
    "title": "环境保护 Q5",
    "part": "Part 1",
    "prompt": "Can one person really make a difference in protecting the environment?",
    "followUps": [],
    "tags": [
      "口语素养",
      "环境保护"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Yes, I believe one person can make a difference, even if the effect seems small at first. Social change often begins with individual choices and habits. When one person starts acting responsibly, others may notice and do the same. In this way, small personal actions can gradually influence a larger group. Environmental protection requires collective effort, but every individual is still an important part of that effort.",
    "sectionLabel": "环境保护",
    "isRequired": false,
    "categoryId": "regular-category-09",
    "categorySlug": "category-09",
    "categoryTitle": "环境保护",
    "sortOrder": 5
  },
  {
    "id": "regular-10-01",
    "slug": "regular-10-01",
    "title": "社交媒体 Q1",
    "part": "Part 1",
    "prompt": "What is your opinion on social media?",
    "followUps": [],
    "tags": [
      "口语素养",
      "社交媒体"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Social media is a very useful tool, but it also has some negative effects. On the positive side, it helps people communicate easily, get information quickly, and share ideas with others. However, if people spend too much time on it, it may reduce their study efficiency and affect their mental health. In my opinion, social media itself is not bad; the key is whether people use it in a balanced and responsible way.",
    "sectionLabel": "社交媒体",
    "isRequired": false,
    "categoryId": "regular-category-10",
    "categorySlug": "category-10",
    "categoryTitle": "社交媒体",
    "sortOrder": 1
  },
  {
    "id": "regular-10-02",
    "slug": "regular-10-02",
    "title": "社交媒体 Q2",
    "part": "Part 1",
    "prompt": "How does social media influence students?",
    "followUps": [],
    "tags": [
      "口语素养",
      "社交媒体"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Social media influences students in both positive and negative ways. It gives students access to news, educational resources, and communication with others. At the same time, it can also be distracting and make it harder to focus on study. Some students may compare themselves too much with others online and feel anxious. So I think students need self-control in order to use social media wisely.",
    "sectionLabel": "社交媒体",
    "isRequired": false,
    "categoryId": "regular-category-10",
    "categorySlug": "category-10",
    "categoryTitle": "社交媒体",
    "sortOrder": 2
  },
  {
    "id": "regular-10-03",
    "slug": "regular-10-03",
    "title": "社交媒体 Q3",
    "part": "Part 1",
    "prompt": "What are the advantages of social media?",
    "followUps": [],
    "tags": [
      "口语素养",
      "社交媒体"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "One major advantage of social media is convenience. People can communicate with others at any time and share ideas very quickly. It also helps users get information, follow current events, and even learn useful skills through online content. In addition, social media can help people stay connected with friends and family, especially when they are far apart.",
    "sectionLabel": "社交媒体",
    "isRequired": false,
    "categoryId": "regular-category-10",
    "categorySlug": "category-10",
    "categoryTitle": "社交媒体",
    "sortOrder": 3
  },
  {
    "id": "regular-10-04",
    "slug": "regular-10-04",
    "title": "社交媒体 Q4",
    "part": "Part 1",
    "prompt": "What are the disadvantages of social media?",
    "followUps": [],
    "tags": [
      "口语素养",
      "社交媒体"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "One major disadvantage of social media is that it can waste a lot of time if people use it without control. It may also spread false information, create unhealthy comparison, and increase stress or anxiety. For students, too much time on social media can reduce concentration and affect academic performance. That is why I think social media should be used carefully.",
    "sectionLabel": "社交媒体",
    "isRequired": false,
    "categoryId": "regular-category-10",
    "categorySlug": "category-10",
    "categoryTitle": "社交媒体",
    "sortOrder": 4
  },
  {
    "id": "regular-10-05",
    "slug": "regular-10-05",
    "title": "社交媒体 Q5",
    "part": "Part 1",
    "prompt": "How can people use social media in a healthy way?",
    "followUps": [],
    "tags": [
      "口语素养",
      "社交媒体"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "People can use social media in a healthy way by setting time limits and choosing useful content instead of endless entertainment. They should also avoid comparing themselves too much with others and learn to check information critically. Most importantly, online life should not replace real communication and real experiences. A balanced attitude is the best way to benefit from social media while avoiding its harmful effects.",
    "sectionLabel": "社交媒体",
    "isRequired": false,
    "categoryId": "regular-category-10",
    "categorySlug": "category-10",
    "categoryTitle": "社交媒体",
    "sortOrder": 5
  },
  {
    "id": "regular-11-01",
    "slug": "regular-11-01",
    "title": "未来职业规划 Q1",
    "part": "Part 1",
    "prompt": "Please talk about your future career plan.",
    "followUps": [],
    "tags": [
      "口语素养",
      "未来职业规划"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "In the future, I hope to find a job related to my major after graduation. Since I study Robotics Engineering, I would like to work in a field connected with intelligent systems, automation, or AI applications. To achieve this goal, I know I need to improve my professional knowledge, practical skills, and communication ability. I also hope to gain internship experience so that I can better understand the real working environment.",
    "sectionLabel": "未来职业规划",
    "isRequired": false,
    "categoryId": "regular-category-11",
    "categorySlug": "category-11",
    "categoryTitle": "未来职业规划",
    "sortOrder": 1
  },
  {
    "id": "regular-11-02",
    "slug": "regular-11-02",
    "title": "未来职业规划 Q2",
    "part": "Part 1",
    "prompt": "What kind of job would you like to have in the future?",
    "followUps": [],
    "tags": [
      "口语素养",
      "未来职业规划"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "I would like to have a job that is related to technology and allows me to keep learning. For me, an ideal job is not only about earning money, but also about having opportunities for growth and solving meaningful problems. I hope to work in an environment where I can apply what I have learned and continue improving my abilities over time.",
    "sectionLabel": "未来职业规划",
    "isRequired": false,
    "categoryId": "regular-category-11",
    "categorySlug": "category-11",
    "categoryTitle": "未来职业规划",
    "sortOrder": 2
  },
  {
    "id": "regular-11-03",
    "slug": "regular-11-03",
    "title": "未来职业规划 Q3",
    "part": "Part 1",
    "prompt": "What skills are important for your future career?",
    "followUps": [],
    "tags": [
      "口语素养",
      "未来职业规划"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Several skills are important for my future career. First, I need strong professional knowledge and practical ability so that I can handle technical tasks effectively. Second, communication and teamwork are also important because work often requires cooperation with others. Third, problem-solving ability is essential because challenges are unavoidable in any career. I think a successful career requires both technical skills and personal qualities.",
    "sectionLabel": "未来职业规划",
    "isRequired": false,
    "categoryId": "regular-category-11",
    "categorySlug": "category-11",
    "categoryTitle": "未来职业规划",
    "sortOrder": 3
  },
  {
    "id": "regular-11-04",
    "slug": "regular-11-04",
    "title": "未来职业规划 Q4",
    "part": "Part 1",
    "prompt": "Do you think internships are important? Why?",
    "followUps": [],
    "tags": [
      "口语素养",
      "未来职业规划"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Yes, I think internships are very important because they allow students to experience the real working environment before graduation. Through internships, students can understand job requirements, improve practical skills, and identify their strengths and weaknesses. Internships also help people connect theory with practice, which is something classroom learning alone cannot fully provide. In my opinion, internship experience is very valuable for career development.",
    "sectionLabel": "未来职业规划",
    "isRequired": false,
    "categoryId": "regular-category-11",
    "categorySlug": "category-11",
    "categoryTitle": "未来职业规划",
    "sortOrder": 4
  },
  {
    "id": "regular-11-05",
    "slug": "regular-11-05",
    "title": "未来职业规划 Q5",
    "part": "Part 1",
    "prompt": "What does a successful career mean to you?",
    "followUps": [],
    "tags": [
      "口语素养",
      "未来职业规划"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "To me, a successful career means more than just a high salary. Of course, financial stability is important, but I also want to do work that is meaningful and allows me to improve myself. A successful career should include personal growth, professional achievement, and a sense of satisfaction. I think true success comes from doing something valuable while continuing to learn and develop.",
    "sectionLabel": "未来职业规划",
    "isRequired": false,
    "categoryId": "regular-category-11",
    "categorySlug": "category-11",
    "categoryTitle": "未来职业规划",
    "sortOrder": 5
  },
  {
    "id": "regular-12-01",
    "slug": "regular-12-01",
    "title": "校园活动 Q1",
    "part": "Part 1",
    "prompt": "Do you think campus activities are important for students?",
    "followUps": [],
    "tags": [
      "口语素养",
      "校园活动"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Yes, I definitely think campus activities are important for students. They provide opportunities for relaxation and help students enjoy university life beyond the classroom. They also help students develop useful skills such as teamwork, leadership, communication, and organization. In addition, campus activities make it easier for students to make friends and feel connected to the university community.",
    "sectionLabel": "校园活动",
    "isRequired": false,
    "categoryId": "regular-category-12",
    "categorySlug": "category-12",
    "categoryTitle": "校园活动",
    "sortOrder": 1
  },
  {
    "id": "regular-12-02",
    "slug": "regular-12-02",
    "title": "校园活动 Q2",
    "part": "Part 1",
    "prompt": "What kind of campus activities do you like?",
    "followUps": [],
    "tags": [
      "口语素养",
      "校园活动"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "I like campus activities that are both interesting and meaningful. For example, I enjoy events where students can communicate, share ideas, or learn practical skills. Activities related to culture, technology, or teamwork are especially attractive to me. I think good campus activities should not only be fun, but also help students grow in some way.",
    "sectionLabel": "校园活动",
    "isRequired": false,
    "categoryId": "regular-category-12",
    "categorySlug": "category-12",
    "categoryTitle": "校园活动",
    "sortOrder": 2
  },
  {
    "id": "regular-12-03",
    "slug": "regular-12-03",
    "title": "校园活动 Q3",
    "part": "Part 1",
    "prompt": "How can campus activities help students grow?",
    "followUps": [],
    "tags": [
      "口语素养",
      "校园活动"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Campus activities help students grow by giving them experiences outside academic study. Through these activities, students can improve communication, teamwork, leadership, and problem-solving skills. They also learn how to organize tasks and deal with real situations. In my opinion, this kind of growth is very important because personal development is not limited to the classroom.",
    "sectionLabel": "校园活动",
    "isRequired": false,
    "categoryId": "regular-category-12",
    "categorySlug": "category-12",
    "categoryTitle": "校园活动",
    "sortOrder": 3
  },
  {
    "id": "regular-12-04",
    "slug": "regular-12-04",
    "title": "校园活动 Q4",
    "part": "Part 1",
    "prompt": "Should all students join campus activities?",
    "followUps": [],
    "tags": [
      "口语素养",
      "校园活动"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "I think most students should try to join at least some campus activities, but it depends on their interests and schedules. Participating in activities can help students become more active, confident, and socially connected. However, students should also manage their time carefully so that activities do not interfere too much with study. A balanced approach is the best choice.",
    "sectionLabel": "校园活动",
    "isRequired": false,
    "categoryId": "regular-category-12",
    "categorySlug": "category-12",
    "categoryTitle": "校园活动",
    "sortOrder": 4
  },
  {
    "id": "regular-12-05",
    "slug": "regular-12-05",
    "title": "校园活动 Q5",
    "part": "Part 1",
    "prompt": "What is the difference between classroom learning and campus activities?",
    "followUps": [],
    "tags": [
      "口语素养",
      "校园活动"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Classroom learning mainly focuses on academic knowledge, while campus activities provide practical and social experience. In class, students learn theories, concepts, and structured knowledge. In activities, they often practice communication, teamwork, and real-life problem solving. I think these two parts complement each other, and together they form a more complete university experience.",
    "sectionLabel": "校园活动",
    "isRequired": false,
    "categoryId": "regular-category-12",
    "categorySlug": "category-12",
    "categoryTitle": "校园活动",
    "sortOrder": 5
  },
  {
    "id": "regular-13-01",
    "slug": "regular-13-01",
    "title": "图书馆 / 宿舍 / 课堂 Q1",
    "part": "Part 1",
    "prompt": "Please describe a place on campus that is important to you.",
    "followUps": [],
    "tags": [
      "口语素养",
      "图书馆 / 宿舍 / 课堂"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "A place on campus that is very important to me is the library. I like it because it provides a quiet and focused environment for study. Whenever I need to prepare for exams, finish assignments, or simply read, the library is usually my first choice. It has a serious but comfortable atmosphere, which helps me concentrate better. For me, the library is a place where I can improve myself and work toward my goals.",
    "sectionLabel": "图书馆 / 宿舍 / 课堂",
    "isRequired": false,
    "categoryId": "regular-category-13",
    "categorySlug": "category-13",
    "categoryTitle": "图书馆 / 宿舍 / 课堂",
    "sortOrder": 1
  },
  {
    "id": "regular-13-02",
    "slug": "regular-13-02",
    "title": "图书馆 / 宿舍 / 课堂 Q2",
    "part": "Part 1",
    "prompt": "What do you think makes a good classroom environment?",
    "followUps": [],
    "tags": [
      "口语素养",
      "图书馆 / 宿舍 / 课堂"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "I think a good classroom environment should be clean, organized, and interactive. Students need a comfortable space where they can focus on the lesson without too many distractions. At the same time, a good classroom should encourage participation and communication, so that students feel comfortable expressing their ideas. The teacher’s attitude and teaching style also play an important role in creating a positive classroom environment.",
    "sectionLabel": "图书馆 / 宿舍 / 课堂",
    "isRequired": false,
    "categoryId": "regular-category-13",
    "categorySlug": "category-13",
    "categoryTitle": "图书馆 / 宿舍 / 课堂",
    "sortOrder": 2
  },
  {
    "id": "regular-13-03",
    "slug": "regular-13-03",
    "title": "图书馆 / 宿舍 / 课堂 Q3",
    "part": "Part 1",
    "prompt": "What is dormitory life like?",
    "followUps": [],
    "tags": [
      "口语素养",
      "图书馆 / 宿舍 / 课堂"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Dormitory life can be both convenient and challenging. It is convenient because students live close to classrooms and campus facilities, and they can easily interact with roommates and classmates. However, dormitory life also requires patience and respect, because people may have different habits and schedules. I think dormitory life teaches students how to live with others, adjust to differences, and become more independent.",
    "sectionLabel": "图书馆 / 宿舍 / 课堂",
    "isRequired": false,
    "categoryId": "regular-category-13",
    "categorySlug": "category-13",
    "categoryTitle": "图书馆 / 宿舍 / 课堂",
    "sortOrder": 3
  },
  {
    "id": "regular-13-04",
    "slug": "regular-13-04",
    "title": "图书馆 / 宿舍 / 课堂 Q4",
    "part": "Part 1",
    "prompt": "Why do many students like studying in the library?",
    "followUps": [],
    "tags": [
      "口语素养",
      "图书馆 / 宿舍 / 课堂"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Many students like studying in the library because it is usually quieter and more suitable for concentration than other places. The environment in the library creates a serious learning atmosphere, which can motivate students to focus better. In addition, libraries often provide useful resources such as books, computers, and study spaces. That is why the library is an important place in university life.",
    "sectionLabel": "图书馆 / 宿舍 / 课堂",
    "isRequired": false,
    "categoryId": "regular-category-13",
    "categorySlug": "category-13",
    "categoryTitle": "图书馆 / 宿舍 / 课堂",
    "sortOrder": 4
  },
  {
    "id": "regular-13-05",
    "slug": "regular-13-05",
    "title": "图书馆 / 宿舍 / 课堂 Q5",
    "part": "Part 1",
    "prompt": "Which do you prefer, studying in the classroom, dormitory, or library?",
    "followUps": [],
    "tags": [
      "口语素养",
      "图书馆 / 宿舍 / 课堂"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "I prefer studying in the library because it offers the best environment for concentration. The dormitory is convenient, but it can be noisy or distracting. Classrooms are useful during lessons, but they are not always available for personal study. In comparison, the library is usually quieter and more structured, which makes it easier for me to stay focused and productive.",
    "sectionLabel": "图书馆 / 宿舍 / 课堂",
    "isRequired": false,
    "categoryId": "regular-category-13",
    "categorySlug": "category-13",
    "categoryTitle": "图书馆 / 宿舍 / 课堂",
    "sortOrder": 5
  },
  {
    "id": "regular-14-01",
    "slug": "regular-14-01",
    "title": "团队合作 Q1",
    "part": "Part 1",
    "prompt": "Please talk about the importance of teamwork.",
    "followUps": [],
    "tags": [
      "口语素养",
      "团队合作"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Teamwork is very important because many tasks cannot be completed efficiently by only one person. In a team, different members can contribute different ideas, skills, and experiences, which often leads to better results. Good teamwork also helps people learn how to communicate, cooperate, and solve problems together. In my opinion, teamwork is an essential ability for both students and future professionals.",
    "sectionLabel": "团队合作",
    "isRequired": false,
    "categoryId": "regular-category-14",
    "categorySlug": "category-14",
    "categoryTitle": "团队合作",
    "sortOrder": 1
  },
  {
    "id": "regular-14-02",
    "slug": "regular-14-02",
    "title": "团队合作 Q2",
    "part": "Part 1",
    "prompt": "What makes a team work well?",
    "followUps": [],
    "tags": [
      "口语素养",
      "团队合作"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "A team works well when its members have clear goals, good communication, and mutual respect. Everyone should understand their responsibilities and be willing to contribute. It is also important for team members to listen to each other and solve disagreements in a calm way. A successful team is not just a group of individuals, but a group that knows how to cooperate effectively.",
    "sectionLabel": "团队合作",
    "isRequired": false,
    "categoryId": "regular-category-14",
    "categorySlug": "category-14",
    "categoryTitle": "团队合作",
    "sortOrder": 2
  },
  {
    "id": "regular-14-03",
    "slug": "regular-14-03",
    "title": "团队合作 Q3",
    "part": "Part 1",
    "prompt": "Have you ever worked in a team? What did you learn?",
    "followUps": [],
    "tags": [
      "口语素养",
      "团队合作"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Yes, I have worked in a team before, and it taught me many useful lessons. I learned that teamwork requires patience, communication, and responsibility. Sometimes people have different ideas, so it is important to discuss problems openly and focus on the common goal. I also realized that each person has different strengths, and a good team should make use of those differences.",
    "sectionLabel": "团队合作",
    "isRequired": false,
    "categoryId": "regular-category-14",
    "categorySlug": "category-14",
    "categoryTitle": "团队合作",
    "sortOrder": 3
  },
  {
    "id": "regular-14-04",
    "slug": "regular-14-04",
    "title": "团队合作 Q4",
    "part": "Part 1",
    "prompt": "What problems can happen in teamwork?",
    "followUps": [],
    "tags": [
      "口语素养",
      "团队合作"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Several problems can happen in teamwork. For example, some members may not communicate clearly, while others may not do their share of the work. Disagreements about ideas or methods can also create tension. However, I think these problems can be reduced if the team has clear roles, honest communication, and a fair attitude toward responsibilities.",
    "sectionLabel": "团队合作",
    "isRequired": false,
    "categoryId": "regular-category-14",
    "categorySlug": "category-14",
    "categoryTitle": "团队合作",
    "sortOrder": 4
  },
  {
    "id": "regular-14-05",
    "slug": "regular-14-05",
    "title": "团队合作 Q5",
    "part": "Part 1",
    "prompt": "Is teamwork more important than individual ability?",
    "followUps": [],
    "tags": [
      "口语素养",
      "团队合作"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "I think both teamwork and individual ability are important, and they should support each other. Individual ability is necessary because each team member needs to contribute something valuable. However, in many real situations, teamwork becomes even more important because success often depends on cooperation rather than personal effort alone. So I would say teamwork is especially important when people need to achieve a common goal together.",
    "sectionLabel": "团队合作",
    "isRequired": false,
    "categoryId": "regular-category-14",
    "categorySlug": "category-14",
    "categoryTitle": "团队合作",
    "sortOrder": 5
  },
  {
    "id": "regular-15-01",
    "slug": "regular-15-01",
    "title": "压力与时间管理 Q1",
    "part": "Part 1",
    "prompt": "How do you deal with stress and manage your time?",
    "followUps": [],
    "tags": [
      "口语素养",
      "压力与时间管理"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "When I feel stressed, I usually try to calm down first and think about the real cause of the problem. Instead of avoiding pressure, I prefer to deal with it step by step. I often make a simple plan for my tasks, decide which things are most urgent, and complete them in order. This helps me reduce confusion and use my time more effectively. I also think it is important to rest, sleep well, and do something relaxing from time to time.",
    "sectionLabel": "压力与时间管理",
    "isRequired": false,
    "categoryId": "regular-category-15",
    "categorySlug": "category-15",
    "categoryTitle": "压力与时间管理",
    "sortOrder": 1
  },
  {
    "id": "regular-15-02",
    "slug": "regular-15-02",
    "title": "压力与时间管理 Q2",
    "part": "Part 1",
    "prompt": "Why do many students feel stressed?",
    "followUps": [],
    "tags": [
      "口语素养",
      "压力与时间管理"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Many students feel stressed because they face pressure from study, exams, future career choices, and sometimes social relationships as well. University life gives students more freedom, but it also gives them more responsibility. If students do not manage their time well, they can easily feel overwhelmed. I think stress is common, but it becomes easier to handle when people stay organized and ask for support when necessary.",
    "sectionLabel": "压力与时间管理",
    "isRequired": false,
    "categoryId": "regular-category-15",
    "categorySlug": "category-15",
    "categoryTitle": "压力与时间管理",
    "sortOrder": 2
  },
  {
    "id": "regular-15-03",
    "slug": "regular-15-03",
    "title": "压力与时间管理 Q3",
    "part": "Part 1",
    "prompt": "What are good ways to manage time?",
    "followUps": [],
    "tags": [
      "口语素养",
      "压力与时间管理"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Good time management starts with having a clear plan. People should list their tasks, set priorities, and avoid wasting too much time on unimportant things. It is also helpful to break big tasks into smaller steps so that work feels more manageable. In addition, people should leave time for rest, because good time management is not just about working more, but also about working more effectively.",
    "sectionLabel": "压力与时间管理",
    "isRequired": false,
    "categoryId": "regular-category-15",
    "categorySlug": "category-15",
    "categoryTitle": "压力与时间管理",
    "sortOrder": 3
  },
  {
    "id": "regular-15-04",
    "slug": "regular-15-04",
    "title": "压力与时间管理 Q4",
    "part": "Part 1",
    "prompt": "How can students reduce pressure in daily life?",
    "followUps": [],
    "tags": [
      "口语素养",
      "压力与时间管理"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Students can reduce pressure by building healthy habits and keeping a balanced lifestyle. For example, they can make study plans, get enough sleep, exercise regularly, and talk with friends or family when they feel stressed. It is also important to have realistic expectations instead of putting too much pressure on themselves. Small daily habits can make a big difference in mental well-being.",
    "sectionLabel": "压力与时间管理",
    "isRequired": false,
    "categoryId": "regular-category-15",
    "categorySlug": "category-15",
    "categoryTitle": "压力与时间管理",
    "sortOrder": 4
  },
  {
    "id": "regular-15-05",
    "slug": "regular-15-05",
    "title": "压力与时间管理 Q5",
    "part": "Part 1",
    "prompt": "Do you think stress can sometimes be helpful?",
    "followUps": [],
    "tags": [
      "口语素养",
      "压力与时间管理"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Yes, I think a certain amount of stress can be helpful because it can motivate people to take action and stay focused on their goals. For example, a deadline can encourage students to manage their time better and complete tasks more efficiently. However, too much stress is harmful because it affects both mental and physical health. So I believe the key is not to eliminate stress completely, but to manage it in a healthy way.",
    "sectionLabel": "压力与时间管理",
    "isRequired": false,
    "categoryId": "regular-category-15",
    "categorySlug": "category-15",
    "categoryTitle": "压力与时间管理",
    "sortOrder": 5
  },
  {
    "id": "regular-16-01",
    "slug": "regular-16-01",
    "title": "电影与电视剧 Q1",
    "part": "Part 1",
    "prompt": "What kind of movies or TV shows do you like?",
    "followUps": [],
    "tags": [
      "口语素养",
      "电影与电视剧"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "I like movies and TV shows that are both entertaining and meaningful. For example, I enjoy science fiction because it is imaginative and often makes people think about technology and the future. I also like realistic dramas because they reflect real emotions and social issues. In my opinion, good films and shows should not only help people relax, but also leave them with something to think about.",
    "sectionLabel": "电影与电视剧",
    "isRequired": false,
    "categoryId": "regular-category-16",
    "categorySlug": "category-16",
    "categoryTitle": "电影与电视剧",
    "sortOrder": 1
  },
  {
    "id": "regular-16-02",
    "slug": "regular-16-02",
    "title": "电影与电视剧 Q2",
    "part": "Part 1",
    "prompt": "Why do people enjoy watching movies?",
    "followUps": [],
    "tags": [
      "口语素养",
      "电影与电视剧"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "I think people enjoy watching movies because movies provide both relaxation and emotional experience. They allow people to escape from daily pressure for a while and enter a different world. At the same time, movies can make people laugh, feel moved, or reflect on life. In my opinion, films are a combination of entertainment, art, and storytelling.",
    "sectionLabel": "电影与电视剧",
    "isRequired": false,
    "categoryId": "regular-category-16",
    "categorySlug": "category-16",
    "categoryTitle": "电影与电视剧",
    "sortOrder": 2
  },
  {
    "id": "regular-16-03",
    "slug": "regular-16-03",
    "title": "电影与电视剧 Q3",
    "part": "Part 1",
    "prompt": "Do you prefer watching movies at home or in the cinema?",
    "followUps": [],
    "tags": [
      "口语素养",
      "电影与电视剧"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "I prefer watching movies at home because it is more convenient and comfortable. At home, I can choose the time freely, pause whenever I want, and enjoy a more relaxed environment. However, I also think the cinema has its own advantages, especially the large screen and stronger atmosphere. So for me, it depends on the kind of movie and the situation.",
    "sectionLabel": "电影与电视剧",
    "isRequired": false,
    "categoryId": "regular-category-16",
    "categorySlug": "category-16",
    "categoryTitle": "电影与电视剧",
    "sortOrder": 3
  },
  {
    "id": "regular-16-04",
    "slug": "regular-16-04",
    "title": "电影与电视剧 Q4",
    "part": "Part 1",
    "prompt": "Can movies teach people something?",
    "followUps": [],
    "tags": [
      "口语素养",
      "电影与电视剧"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Yes, I think movies can definitely teach people something. Some movies introduce history, culture, or social problems in a way that is easier to understand and remember. Others may inspire people with positive values such as courage, kindness, or responsibility. In my opinion, movies are not only for entertainment; they can also broaden people’s minds.",
    "sectionLabel": "电影与电视剧",
    "isRequired": false,
    "categoryId": "regular-category-16",
    "categorySlug": "category-16",
    "categoryTitle": "电影与电视剧",
    "sortOrder": 4
  },
  {
    "id": "regular-16-05",
    "slug": "regular-16-05",
    "title": "电影与电视剧 Q5",
    "part": "Part 1",
    "prompt": "How have online platforms changed the way people watch shows?",
    "followUps": [],
    "tags": [
      "口语素养",
      "电影与电视剧"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Online platforms have changed the way people watch shows by making content much easier to access. People no longer need to follow fixed schedules on television because they can watch what they want at any time. This gives viewers more freedom and convenience. At the same time, it also means people may spend too much time watching if they do not control themselves well.",
    "sectionLabel": "电影与电视剧",
    "isRequired": false,
    "categoryId": "regular-category-16",
    "categorySlug": "category-16",
    "categoryTitle": "电影与电视剧",
    "sortOrder": 5
  },
  {
    "id": "regular-17-01",
    "slug": "regular-17-01",
    "title": "音乐与艺术 Q1",
    "part": "Part 1",
    "prompt": "What role does music play in your life?",
    "followUps": [],
    "tags": [
      "口语素养",
      "音乐与艺术"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Music plays an important role in my life because it helps me relax, adjust my mood, and sometimes even stay focused. Different kinds of music are suitable for different situations. For example, calm music helps me feel peaceful, while energetic music can make me feel more motivated. I think music is a simple but powerful part of daily life.",
    "sectionLabel": "音乐与艺术",
    "isRequired": false,
    "categoryId": "regular-category-17",
    "categorySlug": "category-17",
    "categoryTitle": "音乐与艺术",
    "sortOrder": 1
  },
  {
    "id": "regular-17-02",
    "slug": "regular-17-02",
    "title": "音乐与艺术 Q2",
    "part": "Part 1",
    "prompt": "Why do many people enjoy music?",
    "followUps": [],
    "tags": [
      "口语素养",
      "音乐与艺术"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Many people enjoy music because it connects with emotions very naturally. Music can make people feel happy, calm, excited, or even comforted when they are sad. It is also a way for people to express themselves and enjoy beauty. In my opinion, music is universal because almost everyone can relate to it in some way.",
    "sectionLabel": "音乐与艺术",
    "isRequired": false,
    "categoryId": "regular-category-17",
    "categorySlug": "category-17",
    "categoryTitle": "音乐与艺术",
    "sortOrder": 2
  },
  {
    "id": "regular-17-03",
    "slug": "regular-17-03",
    "title": "音乐与艺术 Q3",
    "part": "Part 1",
    "prompt": "Do you think art is important in education?",
    "followUps": [],
    "tags": [
      "口语素养",
      "音乐与艺术"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Yes, I think art is important in education because it helps students develop creativity, imagination, and emotional understanding. Education should not only focus on exams and technical knowledge. Art can make students more open-minded and help them appreciate beauty and different perspectives. In my opinion, a balanced education should include both science and art.",
    "sectionLabel": "音乐与艺术",
    "isRequired": false,
    "categoryId": "regular-category-17",
    "categorySlug": "category-17",
    "categoryTitle": "音乐与艺术",
    "sortOrder": 3
  },
  {
    "id": "regular-17-04",
    "slug": "regular-17-04",
    "title": "音乐与艺术 Q4",
    "part": "Part 1",
    "prompt": "What kind of art do you appreciate most?",
    "followUps": [],
    "tags": [
      "口语素养",
      "音乐与艺术"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "I appreciate art that can express deep emotions or ideas in a clear and memorable way. This could be music, painting, film, or other forms of creative work. I especially like art that makes people reflect on life or see familiar things from a different angle. For me, meaningful art is more impressive than something that is only visually attractive.",
    "sectionLabel": "音乐与艺术",
    "isRequired": false,
    "categoryId": "regular-category-17",
    "categorySlug": "category-17",
    "categoryTitle": "音乐与艺术",
    "sortOrder": 4
  },
  {
    "id": "regular-17-05",
    "slug": "regular-17-05",
    "title": "音乐与艺术 Q5",
    "part": "Part 1",
    "prompt": "Can music bring people from different cultures together?",
    "followUps": [],
    "tags": [
      "口语素养",
      "音乐与艺术"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Yes, I believe music can bring people from different cultures together. Even if people speak different languages, they can still connect through rhythm, melody, and emotion. Music creates a shared experience that goes beyond words. In my opinion, it is one of the best examples of how art can build cultural understanding.",
    "sectionLabel": "音乐与艺术",
    "isRequired": false,
    "categoryId": "regular-category-17",
    "categorySlug": "category-17",
    "categoryTitle": "音乐与艺术",
    "sortOrder": 5
  },
  {
    "id": "regular-18-01",
    "slug": "regular-18-01",
    "title": "阅读与书籍 Q1",
    "part": "Part 1",
    "prompt": "Do you like reading? Why or why not?",
    "followUps": [],
    "tags": [
      "口语素养",
      "阅读与书籍"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Yes, I like reading because it helps me learn new ideas and see the world from different perspectives. Reading can also be a good way to relax, especially when I want some quiet time. Different kinds of books offer different value, such as knowledge, inspiration, or entertainment. In my opinion, reading is one of the most useful habits a person can develop.",
    "sectionLabel": "阅读与书籍",
    "isRequired": false,
    "categoryId": "regular-category-18",
    "categorySlug": "category-18",
    "categoryTitle": "阅读与书籍",
    "sortOrder": 1
  },
  {
    "id": "regular-18-02",
    "slug": "regular-18-02",
    "title": "阅读与书籍 Q2",
    "part": "Part 1",
    "prompt": "What kinds of books do you enjoy?",
    "followUps": [],
    "tags": [
      "口语素养",
      "阅读与书籍"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "I enjoy books that are either informative or thought-provoking. For example, I like books related to technology, personal growth, or real-life experiences. I think reading such books is meaningful because it not only gives information but also encourages reflection. A good book can stay in a person’s mind for a long time.",
    "sectionLabel": "阅读与书籍",
    "isRequired": false,
    "categoryId": "regular-category-18",
    "categorySlug": "category-18",
    "categoryTitle": "阅读与书籍",
    "sortOrder": 2
  },
  {
    "id": "regular-18-03",
    "slug": "regular-18-03",
    "title": "阅读与书籍 Q3",
    "part": "Part 1",
    "prompt": "Why is reading important for students?",
    "followUps": [],
    "tags": [
      "口语素养",
      "阅读与书籍"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Reading is important for students because it improves language ability, broadens knowledge, and strengthens thinking skills. Students who read regularly are often better at expressing ideas and understanding complex topics. Reading also helps people become more patient and focused. In my opinion, it is an important part of both academic success and personal development.",
    "sectionLabel": "阅读与书籍",
    "isRequired": false,
    "categoryId": "regular-category-18",
    "categorySlug": "category-18",
    "categoryTitle": "阅读与书籍",
    "sortOrder": 3
  },
  {
    "id": "regular-18-04",
    "slug": "regular-18-04",
    "title": "阅读与书籍 Q4",
    "part": "Part 1",
    "prompt": "Do you prefer paper books or e-books?",
    "followUps": [],
    "tags": [
      "口语素养",
      "阅读与书籍"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "I think both paper books and e-books have advantages. Paper books feel more traditional and can make reading more immersive, while e-books are more convenient because they are easy to carry and access. Personally, I prefer whichever format is more practical in a given situation. The most important thing is not the format, but the habit of reading itself.",
    "sectionLabel": "阅读与书籍",
    "isRequired": false,
    "categoryId": "regular-category-18",
    "categorySlug": "category-18",
    "categoryTitle": "阅读与书籍",
    "sortOrder": 4
  },
  {
    "id": "regular-18-05",
    "slug": "regular-18-05",
    "title": "阅读与书籍 Q5",
    "part": "Part 1",
    "prompt": "Can books change a person’s way of thinking?",
    "followUps": [],
    "tags": [
      "口语素养",
      "阅读与书籍"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Yes, I think books can definitely change a person’s way of thinking. A good book can introduce new ideas, challenge old beliefs, and encourage deeper reflection. Sometimes reading about other people’s experiences can make us more understanding and open-minded. In my opinion, books have the power to shape both knowledge and character.",
    "sectionLabel": "阅读与书籍",
    "isRequired": false,
    "categoryId": "regular-category-18",
    "categorySlug": "category-18",
    "categoryTitle": "阅读与书籍",
    "sortOrder": 5
  },
  {
    "id": "regular-19-01",
    "slug": "regular-19-01",
    "title": "网络学习与在线课程 Q1",
    "part": "Part 1",
    "prompt": "What do you think of online learning?",
    "followUps": [],
    "tags": [
      "口语素养",
      "网络学习与在线课程"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "I think online learning is very useful because it gives students more flexibility and access to different kinds of resources. People can learn at their own pace and choose courses that fit their interests or needs. However, online learning also requires self-discipline, because it is easy to lose focus without direct supervision. In my opinion, it is a valuable learning method when used properly.",
    "sectionLabel": "网络学习与在线课程",
    "isRequired": false,
    "categoryId": "regular-category-19",
    "categorySlug": "category-19",
    "categoryTitle": "网络学习与在线课程",
    "sortOrder": 1
  },
  {
    "id": "regular-19-02",
    "slug": "regular-19-02",
    "title": "网络学习与在线课程 Q2",
    "part": "Part 1",
    "prompt": "What are the advantages of online courses?",
    "followUps": [],
    "tags": [
      "口语素养",
      "网络学习与在线课程"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Online courses have several advantages. First, they make education more accessible because people can learn from anywhere. Second, they offer flexibility in time and schedule, which is helpful for busy students. Third, online platforms often provide a wide range of topics and materials. I think these advantages make online learning an important part of modern education.",
    "sectionLabel": "网络学习与在线课程",
    "isRequired": false,
    "categoryId": "regular-category-19",
    "categorySlug": "category-19",
    "categoryTitle": "网络学习与在线课程",
    "sortOrder": 2
  },
  {
    "id": "regular-19-03",
    "slug": "regular-19-03",
    "title": "网络学习与在线课程 Q3",
    "part": "Part 1",
    "prompt": "What are the disadvantages of online learning?",
    "followUps": [],
    "tags": [
      "口语素养",
      "网络学习与在线课程"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "One disadvantage of online learning is that students may feel less motivated or less connected to teachers and classmates. It can also be difficult to stay focused for a long time in front of a screen. In addition, some practical subjects are harder to teach online. So although online learning is convenient, it cannot completely replace face-to-face education.",
    "sectionLabel": "网络学习与在线课程",
    "isRequired": false,
    "categoryId": "regular-category-19",
    "categorySlug": "category-19",
    "categoryTitle": "网络学习与在线课程",
    "sortOrder": 3
  },
  {
    "id": "regular-19-04",
    "slug": "regular-19-04",
    "title": "网络学习与在线课程 Q4",
    "part": "Part 1",
    "prompt": "Do you think online learning will replace traditional classrooms?",
    "followUps": [],
    "tags": [
      "口语素养",
      "网络学习与在线课程"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "I do not think online learning will fully replace traditional classrooms. Online learning is flexible and convenient, but traditional classrooms provide direct interaction, a stronger learning atmosphere, and better support for communication. In my opinion, the future is more likely to be a combination of both methods rather than one replacing the other completely.",
    "sectionLabel": "网络学习与在线课程",
    "isRequired": false,
    "categoryId": "regular-category-19",
    "categorySlug": "category-19",
    "categoryTitle": "网络学习与在线课程",
    "sortOrder": 4
  },
  {
    "id": "regular-19-05",
    "slug": "regular-19-05",
    "title": "网络学习与在线课程 Q5",
    "part": "Part 1",
    "prompt": "How can students learn effectively online?",
    "followUps": [],
    "tags": [
      "口语素养",
      "网络学习与在线课程"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Students can learn effectively online by making a clear study plan and keeping a regular schedule. It is also important to create a quiet environment, take notes actively, and avoid distractions such as social media. In addition, students should review what they learn and ask questions when necessary. Good self-management is the key to successful online learning.",
    "sectionLabel": "网络学习与在线课程",
    "isRequired": false,
    "categoryId": "regular-category-19",
    "categorySlug": "category-19",
    "categoryTitle": "网络学习与在线课程",
    "sortOrder": 5
  },
  {
    "id": "regular-20-01",
    "slug": "regular-20-01",
    "title": "手机与数字生活 Q1",
    "part": "Part 1",
    "prompt": "How important is your smartphone in daily life?",
    "followUps": [],
    "tags": [
      "口语素养",
      "手机与数字生活"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "My smartphone is very important in daily life because I use it for communication, study, entertainment, and many practical tasks. It helps me check messages, search for information, manage my schedule, and stay connected with others. At the same time, I know that depending too much on it is not healthy. So I think smartphones are useful tools, but they should be used with balance.",
    "sectionLabel": "手机与数字生活",
    "isRequired": false,
    "categoryId": "regular-category-20",
    "categorySlug": "category-20",
    "categoryTitle": "手机与数字生活",
    "sortOrder": 1
  },
  {
    "id": "regular-20-02",
    "slug": "regular-20-02",
    "title": "手机与数字生活 Q2",
    "part": "Part 1",
    "prompt": "What are the benefits of smartphones?",
    "followUps": [],
    "tags": [
      "口语素养",
      "手机与数字生活"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Smartphones bring many benefits because they make life more convenient and efficient. People can contact others instantly, get information quickly, use maps, study online, and complete many everyday tasks on one device. In my opinion, smartphones have greatly improved communication and access to knowledge.",
    "sectionLabel": "手机与数字生活",
    "isRequired": false,
    "categoryId": "regular-category-20",
    "categorySlug": "category-20",
    "categoryTitle": "手机与数字生活",
    "sortOrder": 2
  },
  {
    "id": "regular-20-03",
    "slug": "regular-20-03",
    "title": "手机与数字生活 Q3",
    "part": "Part 1",
    "prompt": "What problems can smartphones cause?",
    "followUps": [],
    "tags": [
      "口语素养",
      "手机与数字生活"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Smartphones can cause problems such as distraction, reduced concentration, and too much screen time. Some people rely on them so much that they spend less time communicating face to face or paying attention to the real world. In addition, excessive use may affect sleep and mental health. That is why I think it is important to use smartphones wisely.",
    "sectionLabel": "手机与数字生活",
    "isRequired": false,
    "categoryId": "regular-category-20",
    "categorySlug": "category-20",
    "categoryTitle": "手机与数字生活",
    "sortOrder": 3
  },
  {
    "id": "regular-20-04",
    "slug": "regular-20-04",
    "title": "手机与数字生活 Q4",
    "part": "Part 1",
    "prompt": "Should students limit phone use during study?",
    "followUps": [],
    "tags": [
      "口语素养",
      "手机与数字生活"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Yes, I think students should limit phone use during study because phones can easily interrupt concentration. Even short distractions can reduce learning efficiency and make it harder to focus deeply. Students can still use phones for helpful purposes, such as dictionaries or educational apps, but unnecessary use should be controlled. A disciplined approach is very important.",
    "sectionLabel": "手机与数字生活",
    "isRequired": false,
    "categoryId": "regular-category-20",
    "categorySlug": "category-20",
    "categoryTitle": "手机与数字生活",
    "sortOrder": 4
  },
  {
    "id": "regular-20-05",
    "slug": "regular-20-05",
    "title": "手机与数字生活 Q5",
    "part": "Part 1",
    "prompt": "How has digital life changed people’s habits?",
    "followUps": [],
    "tags": [
      "口语素养",
      "手机与数字生活"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Digital life has changed people’s habits in many ways. People now communicate faster, get information more easily, and spend more time online for work, study, and entertainment. However, digital life has also made some people more dependent on screens and less patient in daily life. In my opinion, digital technology has brought both convenience and new challenges.",
    "sectionLabel": "手机与数字生活",
    "isRequired": false,
    "categoryId": "regular-category-20",
    "categorySlug": "category-20",
    "categoryTitle": "手机与数字生活",
    "sortOrder": 5
  },
  {
    "id": "regular-21-01",
    "slug": "regular-21-01",
    "title": "节日与传统文化 Q1",
    "part": "Part 1",
    "prompt": "What is your favorite festival?",
    "followUps": [],
    "tags": [
      "口语素养",
      "节日与传统文化"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "My favorite festival is one that brings family members together and creates a warm atmosphere. I enjoy festivals not only because of the food or celebrations, but also because they give people a chance to slow down and spend meaningful time with others. In my opinion, festivals are important because they carry emotional value as well as cultural meaning.",
    "sectionLabel": "节日与传统文化",
    "isRequired": false,
    "categoryId": "regular-category-21",
    "categorySlug": "category-21",
    "categoryTitle": "节日与传统文化",
    "sortOrder": 1
  },
  {
    "id": "regular-21-02",
    "slug": "regular-21-02",
    "title": "节日与传统文化 Q2",
    "part": "Part 1",
    "prompt": "Why are traditional festivals important?",
    "followUps": [],
    "tags": [
      "口语素养",
      "节日与传统文化"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Traditional festivals are important because they help preserve culture and pass values from one generation to another. They remind people of shared history, customs, and ways of life. Festivals also strengthen family and community connections. I think they are meaningful because they connect people to both the past and the present.",
    "sectionLabel": "节日与传统文化",
    "isRequired": false,
    "categoryId": "regular-category-21",
    "categorySlug": "category-21",
    "categoryTitle": "节日与传统文化",
    "sortOrder": 2
  },
  {
    "id": "regular-21-03",
    "slug": "regular-21-03",
    "title": "节日与传统文化 Q3",
    "part": "Part 1",
    "prompt": "How do young people celebrate festivals today?",
    "followUps": [],
    "tags": [
      "口语素养",
      "节日与传统文化"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Young people celebrate festivals in both traditional and modern ways. They may still join family gatherings, eat special food, and follow certain customs, but they also share festival experiences online or celebrate in more relaxed ways. I think this shows that culture can continue while also adapting to modern life.",
    "sectionLabel": "节日与传统文化",
    "isRequired": false,
    "categoryId": "regular-category-21",
    "categorySlug": "category-21",
    "categoryTitle": "节日与传统文化",
    "sortOrder": 3
  },
  {
    "id": "regular-21-04",
    "slug": "regular-21-04",
    "title": "节日与传统文化 Q4",
    "part": "Part 1",
    "prompt": "Do you think traditions should be preserved?",
    "followUps": [],
    "tags": [
      "口语素养",
      "节日与传统文化"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Yes, I think traditions should be preserved because they are an important part of cultural identity. They help people understand where they come from and what values their society has developed over time. Of course, not every tradition must remain exactly the same, but the important meaning behind it should be protected. In my opinion, preserving tradition and accepting change should go together.",
    "sectionLabel": "节日与传统文化",
    "isRequired": false,
    "categoryId": "regular-category-21",
    "categorySlug": "category-21",
    "categoryTitle": "节日与传统文化",
    "sortOrder": 4
  },
  {
    "id": "regular-21-05",
    "slug": "regular-21-05",
    "title": "节日与传统文化 Q5",
    "part": "Part 1",
    "prompt": "How can schools help students learn about traditional culture?",
    "followUps": [],
    "tags": [
      "口语素养",
      "节日与传统文化"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Schools can help students learn about traditional culture through lessons, activities, festivals, and practical experiences. For example, they can organize cultural events, invite speakers, or encourage students to explore local customs and history. In my opinion, culture is learned best not only from books, but also from active participation.",
    "sectionLabel": "节日与传统文化",
    "isRequired": false,
    "categoryId": "regular-category-21",
    "categorySlug": "category-21",
    "categoryTitle": "节日与传统文化",
    "sortOrder": 5
  },
  {
    "id": "regular-22-01",
    "slug": "regular-22-01",
    "title": "兼职与社会实践 Q1",
    "part": "Part 1",
    "prompt": "Do you think students should do part-time jobs?",
    "followUps": [],
    "tags": [
      "口语素养",
      "兼职与社会实践"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "I think students can benefit from part-time jobs if they manage their time well. Part-time work helps students gain practical experience, understand responsibility, and become more independent. However, it should not affect their study too much. In my opinion, part-time jobs are useful when they are balanced with academic priorities.",
    "sectionLabel": "兼职与社会实践",
    "isRequired": false,
    "categoryId": "regular-category-22",
    "categorySlug": "category-22",
    "categoryTitle": "兼职与社会实践",
    "sortOrder": 1
  },
  {
    "id": "regular-22-02",
    "slug": "regular-22-02",
    "title": "兼职与社会实践 Q2",
    "part": "Part 1",
    "prompt": "What can students learn from part-time work?",
    "followUps": [],
    "tags": [
      "口语素养",
      "兼职与社会实践"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Students can learn many useful things from part-time work, such as communication, time management, and responsibility. They also get a better understanding of how the real working world operates. In addition, part-time jobs can improve confidence and help students appreciate the value of money. I think these lessons are difficult to get from textbooks alone.",
    "sectionLabel": "兼职与社会实践",
    "isRequired": false,
    "categoryId": "regular-category-22",
    "categorySlug": "category-22",
    "categoryTitle": "兼职与社会实践",
    "sortOrder": 2
  },
  {
    "id": "regular-22-03",
    "slug": "regular-22-03",
    "title": "兼职与社会实践 Q3",
    "part": "Part 1",
    "prompt": "What is the difference between studying and working?",
    "followUps": [],
    "tags": [
      "口语素养",
      "兼职与社会实践"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Studying and working are different in several ways. Studying focuses more on learning knowledge and building ability, while working focuses more on applying skills and meeting responsibilities in real situations. Work often involves more pressure, deadlines, and cooperation with different people. In my opinion, both are important, and study is often preparation for work.",
    "sectionLabel": "兼职与社会实践",
    "isRequired": false,
    "categoryId": "regular-category-22",
    "categorySlug": "category-22",
    "categoryTitle": "兼职与社会实践",
    "sortOrder": 3
  },
  {
    "id": "regular-22-04",
    "slug": "regular-22-04",
    "title": "兼职与社会实践 Q4",
    "part": "Part 1",
    "prompt": "Are social practice activities useful for university students?",
    "followUps": [],
    "tags": [
      "口语素养",
      "兼职与社会实践"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Yes, I think social practice activities are very useful for university students. They help students understand society better and connect academic knowledge with real-life situations. Such activities can also improve communication, teamwork, and problem-solving ability. In my opinion, they are an important part of well-rounded education.",
    "sectionLabel": "兼职与社会实践",
    "isRequired": false,
    "categoryId": "regular-category-22",
    "categorySlug": "category-22",
    "categoryTitle": "兼职与社会实践",
    "sortOrder": 4
  },
  {
    "id": "regular-22-05",
    "slug": "regular-22-05",
    "title": "兼职与社会实践 Q5",
    "part": "Part 1",
    "prompt": "How can practical experience help future careers?",
    "followUps": [],
    "tags": [
      "口语素养",
      "兼职与社会实践"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Practical experience helps future careers by giving students a clearer understanding of workplace expectations and helping them develop useful skills. It also allows them to test their interests and strengths in real environments. In addition, employers often value experience because it shows responsibility and adaptability. I think practical experience can make students more prepared and competitive.",
    "sectionLabel": "兼职与社会实践",
    "isRequired": false,
    "categoryId": "regular-category-22",
    "categorySlug": "category-22",
    "categoryTitle": "兼职与社会实践",
    "sortOrder": 5
  },
  {
    "id": "regular-23-01",
    "slug": "regular-23-01",
    "title": "公共交通与城市生活 Q1",
    "part": "Part 1",
    "prompt": "What do you think of public transportation?",
    "followUps": [],
    "tags": [
      "口语素养",
      "公共交通与城市生活"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "I think public transportation is very important in modern city life because it provides an efficient and affordable way for people to travel. It can reduce traffic pressure, save energy, and make daily life more convenient. In my opinion, a good public transportation system is one of the signs of a well-developed city.",
    "sectionLabel": "公共交通与城市生活",
    "isRequired": false,
    "categoryId": "regular-category-23",
    "categorySlug": "category-23",
    "categoryTitle": "公共交通与城市生活",
    "sortOrder": 1
  },
  {
    "id": "regular-23-02",
    "slug": "regular-23-02",
    "title": "公共交通与城市生活 Q2",
    "part": "Part 1",
    "prompt": "What are the advantages of living in a city?",
    "followUps": [],
    "tags": [
      "口语素养",
      "公共交通与城市生活"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Living in a city has many advantages, such as better transportation, more job opportunities, and easier access to education, healthcare, and entertainment. City life is often faster and more convenient, and people can experience greater diversity. However, cities may also be crowded and stressful. So I think city life offers many opportunities, but it also requires adaptation.",
    "sectionLabel": "公共交通与城市生活",
    "isRequired": false,
    "categoryId": "regular-category-23",
    "categorySlug": "category-23",
    "categoryTitle": "公共交通与城市生活",
    "sortOrder": 2
  },
  {
    "id": "regular-23-03",
    "slug": "regular-23-03",
    "title": "公共交通与城市生活 Q3",
    "part": "Part 1",
    "prompt": "What problems do people face in big cities?",
    "followUps": [],
    "tags": [
      "口语素养",
      "公共交通与城市生活"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "People in big cities often face problems such as traffic congestion, high living costs, noise, and fast-paced lifestyles. Some people may also feel lonely despite living among many others. These challenges can affect quality of life if not managed well. In my opinion, city development should pay more attention to people’s daily well-being.",
    "sectionLabel": "公共交通与城市生活",
    "isRequired": false,
    "categoryId": "regular-category-23",
    "categorySlug": "category-23",
    "categoryTitle": "公共交通与城市生活",
    "sortOrder": 3
  },
  {
    "id": "regular-23-04",
    "slug": "regular-23-04",
    "title": "公共交通与城市生活 Q4",
    "part": "Part 1",
    "prompt": "Do you prefer city life or country life?",
    "followUps": [],
    "tags": [
      "口语素养",
      "公共交通与城市生活"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "I think both city life and country life have their own advantages. City life is more convenient and offers more opportunities, while country life is often quieter and less stressful. Personally, I may prefer city life at this stage because it is more suitable for study and career development. However, I also appreciate the peace and simplicity of the countryside.",
    "sectionLabel": "公共交通与城市生活",
    "isRequired": false,
    "categoryId": "regular-category-23",
    "categorySlug": "category-23",
    "categoryTitle": "公共交通与城市生活",
    "sortOrder": 4
  },
  {
    "id": "regular-23-05",
    "slug": "regular-23-05",
    "title": "公共交通与城市生活 Q5",
    "part": "Part 1",
    "prompt": "How can cities become better places to live?",
    "followUps": [],
    "tags": [
      "口语素养",
      "公共交通与城市生活"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Cities can become better places to live by improving transportation, reducing pollution, creating more green spaces, and making housing and services more accessible. Governments should also pay attention to mental well-being and community life, not only economic growth. In my opinion, a good city should be efficient, healthy, and human-centered.",
    "sectionLabel": "公共交通与城市生活",
    "isRequired": false,
    "categoryId": "regular-category-23",
    "categorySlug": "category-23",
    "categoryTitle": "公共交通与城市生活",
    "sortOrder": 5
  },
  {
    "id": "regular-24-01",
    "slug": "regular-24-01",
    "title": "志愿服务与帮助他人 Q1",
    "part": "Part 1",
    "prompt": "Do you think volunteering is important?",
    "followUps": [],
    "tags": [
      "口语素养",
      "志愿服务与帮助他人"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Yes, I think volunteering is very important because it allows people to help others and make society better in practical ways. Volunteering is not only beneficial for the people who receive help, but also for the volunteers themselves. It can increase empathy, responsibility, and social awareness. In my opinion, volunteering is a meaningful form of personal and social contribution.",
    "sectionLabel": "志愿服务与帮助他人",
    "isRequired": false,
    "categoryId": "regular-category-24",
    "categorySlug": "category-24",
    "categoryTitle": "志愿服务与帮助他人",
    "sortOrder": 1
  },
  {
    "id": "regular-24-02",
    "slug": "regular-24-02",
    "title": "志愿服务与帮助他人 Q2",
    "part": "Part 1",
    "prompt": "What can students gain from volunteer work?",
    "followUps": [],
    "tags": [
      "口语素养",
      "志愿服务与帮助他人"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Students can gain many valuable things from volunteer work, such as communication skills, patience, and a stronger sense of responsibility. They also learn more about different social groups and real-life needs. In addition, helping others often gives people a sense of purpose and satisfaction. I think volunteer work is an important way for students to grow.",
    "sectionLabel": "志愿服务与帮助他人",
    "isRequired": false,
    "categoryId": "regular-category-24",
    "categorySlug": "category-24",
    "categoryTitle": "志愿服务与帮助他人",
    "sortOrder": 2
  },
  {
    "id": "regular-24-03",
    "slug": "regular-24-03",
    "title": "志愿服务与帮助他人 Q3",
    "part": "Part 1",
    "prompt": "Why do some people like helping others?",
    "followUps": [],
    "tags": [
      "口语素养",
      "志愿服务与帮助他人"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Some people like helping others because it makes them feel useful and connected to society. Helping others can also create a sense of happiness and inner satisfaction. In many cases, people help because they understand that everyone may need support at some point in life. In my opinion, kindness is one of the most valuable human qualities.",
    "sectionLabel": "志愿服务与帮助他人",
    "isRequired": false,
    "categoryId": "regular-category-24",
    "categorySlug": "category-24",
    "categoryTitle": "志愿服务与帮助他人",
    "sortOrder": 3
  },
  {
    "id": "regular-24-04",
    "slug": "regular-24-04",
    "title": "志愿服务与帮助他人 Q4",
    "part": "Part 1",
    "prompt": "What kinds of volunteer activities are suitable for university students?",
    "followUps": [],
    "tags": [
      "口语素养",
      "志愿服务与帮助他人"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "University students can take part in many kinds of volunteer activities, such as teaching children, helping elderly people, supporting community events, or joining environmental programs. These activities are suitable because they match students’ energy, learning ability, and social potential. I think students should choose activities that are meaningful and also fit their interests and schedules.",
    "sectionLabel": "志愿服务与帮助他人",
    "isRequired": false,
    "categoryId": "regular-category-24",
    "categorySlug": "category-24",
    "categoryTitle": "志愿服务与帮助他人",
    "sortOrder": 4
  },
  {
    "id": "regular-24-05",
    "slug": "regular-24-05",
    "title": "志愿服务与帮助他人 Q5",
    "part": "Part 1",
    "prompt": "Should volunteering be encouraged in universities?",
    "followUps": [],
    "tags": [
      "口语素养",
      "志愿服务与帮助他人"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Yes, volunteering should definitely be encouraged in universities. University education should not only develop academic ability, but also social responsibility and empathy. By joining volunteer activities, students can connect knowledge with real social needs and become more mature. In my opinion, universities should create more opportunities for this kind of experience.",
    "sectionLabel": "志愿服务与帮助他人",
    "isRequired": false,
    "categoryId": "regular-category-24",
    "categorySlug": "category-24",
    "categoryTitle": "志愿服务与帮助他人",
    "sortOrder": 5
  },
  {
    "id": "regular-25-01",
    "slug": "regular-25-01",
    "title": "健身与运动 Q1",
    "part": "Part 1",
    "prompt": "Do you like sports or exercise?",
    "followUps": [],
    "tags": [
      "口语素养",
      "健身与运动"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Yes, I think sports and exercise are very important, even if I may not always do them as regularly as I should. Exercise helps people stay healthy, reduce stress, and feel more energetic. It is also a good way to build self-discipline and maintain balance in life. In my opinion, physical activity is necessary for both body and mind.",
    "sectionLabel": "健身与运动",
    "isRequired": false,
    "categoryId": "regular-category-25",
    "categorySlug": "category-25",
    "categoryTitle": "健身与运动",
    "sortOrder": 1
  },
  {
    "id": "regular-25-02",
    "slug": "regular-25-02",
    "title": "健身与运动 Q2",
    "part": "Part 1",
    "prompt": "Why should students exercise regularly?",
    "followUps": [],
    "tags": [
      "口语素养",
      "健身与运动"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Students should exercise regularly because exercise improves physical health, reduces stress, and helps maintain better concentration. University life can be mentally demanding, so physical activity is a useful way to stay balanced. In addition, exercise can improve mood and sleep quality. I think regular exercise is one of the best habits students can develop.",
    "sectionLabel": "健身与运动",
    "isRequired": false,
    "categoryId": "regular-category-25",
    "categorySlug": "category-25",
    "categoryTitle": "健身与运动",
    "sortOrder": 2
  },
  {
    "id": "regular-25-03",
    "slug": "regular-25-03",
    "title": "健身与运动 Q3",
    "part": "Part 1",
    "prompt": "What is your favorite way to stay active?",
    "followUps": [],
    "tags": [
      "口语素养",
      "健身与运动"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "My favorite way to stay active is through simple and practical activities, such as walking, light exercise, or playing a sport casually. I prefer forms of exercise that are easy to maintain in daily life rather than something too complicated. In my opinion, the best exercise is the kind that people can do consistently.",
    "sectionLabel": "健身与运动",
    "isRequired": false,
    "categoryId": "regular-category-25",
    "categorySlug": "category-25",
    "categoryTitle": "健身与运动",
    "sortOrder": 3
  },
  {
    "id": "regular-25-04",
    "slug": "regular-25-04",
    "title": "健身与运动 Q4",
    "part": "Part 1",
    "prompt": "Do you think team sports are better than individual sports?",
    "followUps": [],
    "tags": [
      "口语素养",
      "健身与运动"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "I think both team sports and individual sports have their own value. Team sports help people develop cooperation, communication, and group spirit, while individual sports build self-discipline and personal focus. Which one is better depends on a person’s personality and goals. In my opinion, both can contribute to physical and mental growth.",
    "sectionLabel": "健身与运动",
    "isRequired": false,
    "categoryId": "regular-category-25",
    "categorySlug": "category-25",
    "categoryTitle": "健身与运动",
    "sortOrder": 4
  },
  {
    "id": "regular-25-05",
    "slug": "regular-25-05",
    "title": "健身与运动 Q5",
    "part": "Part 1",
    "prompt": "How can universities encourage students to exercise more?",
    "followUps": [],
    "tags": [
      "口语素养",
      "健身与运动"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Universities can encourage students to exercise more by providing better sports facilities, organizing activities, and creating a healthier campus culture. They can also make exercise more accessible and enjoyable instead of treating it only as a requirement. In my opinion, when students see exercise as a positive part of life, they are more likely to continue it.",
    "sectionLabel": "健身与运动",
    "isRequired": false,
    "categoryId": "regular-category-25",
    "categorySlug": "category-25",
    "categoryTitle": "健身与运动",
    "sortOrder": 5
  },
  {
    "id": "regular-26-01",
    "slug": "regular-26-01",
    "title": "消费与理财 Q1",
    "part": "Part 1",
    "prompt": "Do you think university students should learn about money management?",
    "followUps": [],
    "tags": [
      "口语素养",
      "消费与理财"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Yes, I think university students should learn about money management because it is an essential life skill. Many students begin to make more independent financial decisions during university, so they need to understand budgeting and responsible spending. Good money management can reduce stress and prepare students for adult life. In my opinion, financial awareness is just as practical as many academic subjects.",
    "sectionLabel": "消费与理财",
    "isRequired": false,
    "categoryId": "regular-category-26",
    "categorySlug": "category-26",
    "categoryTitle": "消费与理财",
    "sortOrder": 1
  },
  {
    "id": "regular-26-02",
    "slug": "regular-26-02",
    "title": "消费与理财 Q2",
    "part": "Part 1",
    "prompt": "Why is budgeting important?",
    "followUps": [],
    "tags": [
      "口语素养",
      "消费与理财"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Budgeting is important because it helps people understand how much money they have, how much they spend, and where they should be more careful. Without a budget, people may spend too much on unnecessary things and create financial pressure. A good budget helps people stay organized and make smarter decisions. I think it is a simple but very useful habit.",
    "sectionLabel": "消费与理财",
    "isRequired": false,
    "categoryId": "regular-category-26",
    "categorySlug": "category-26",
    "categoryTitle": "消费与理财",
    "sortOrder": 2
  },
  {
    "id": "regular-26-03",
    "slug": "regular-26-03",
    "title": "消费与理财 Q3",
    "part": "Part 1",
    "prompt": "Do young people spend too much money on unnecessary things?",
    "followUps": [],
    "tags": [
      "口语素养",
      "消费与理财"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Sometimes I think young people do spend too much money on unnecessary things, especially because online shopping and advertising make it very easy to buy impulsively. Many purchases bring only short-term satisfaction. That does not mean young people should never enjoy spending money, but they should think more carefully about value and need. In my opinion, self-control is very important.",
    "sectionLabel": "消费与理财",
    "isRequired": false,
    "categoryId": "regular-category-26",
    "categorySlug": "category-26",
    "categoryTitle": "消费与理财",
    "sortOrder": 3
  },
  {
    "id": "regular-26-04",
    "slug": "regular-26-04",
    "title": "消费与理财 Q4",
    "part": "Part 1",
    "prompt": "What is the difference between saving money and spending money wisely?",
    "followUps": [],
    "tags": [
      "口语素养",
      "消费与理财"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Saving money means keeping part of your income for future needs, while spending money wisely means using money carefully and meaningfully. A person does not need to avoid all spending, but should try to make thoughtful choices. In my opinion, wise financial behavior requires both saving and smart spending.",
    "sectionLabel": "消费与理财",
    "isRequired": false,
    "categoryId": "regular-category-26",
    "categorySlug": "category-26",
    "categoryTitle": "消费与理财",
    "sortOrder": 4
  },
  {
    "id": "regular-26-05",
    "slug": "regular-26-05",
    "title": "消费与理财 Q5",
    "part": "Part 1",
    "prompt": "How can students develop good financial habits?",
    "followUps": [],
    "tags": [
      "口语素养",
      "消费与理财"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Students can develop good financial habits by keeping track of their spending, setting simple budgets, and avoiding impulsive purchases. They should also learn to distinguish between needs and wants. In addition, it is helpful to think about long-term goals instead of only short-term satisfaction. Good habits usually begin with small daily choices.",
    "sectionLabel": "消费与理财",
    "isRequired": false,
    "categoryId": "regular-category-26",
    "categorySlug": "category-26",
    "categoryTitle": "消费与理财",
    "sortOrder": 5
  },
  {
    "id": "regular-27-01",
    "slug": "regular-27-01",
    "title": "社会责任与公民意识 Q1",
    "part": "Part 1",
    "prompt": "What does social responsibility mean to you?",
    "followUps": [],
    "tags": [
      "口语素养",
      "社会责任与公民意识"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "To me, social responsibility means caring about the impact of our actions on other people and on society as a whole. It includes following rules, respecting others, and being willing to contribute when possible. Social responsibility is not only something for leaders or organizations; ordinary people also play an important role. In my opinion, it reflects maturity and awareness.",
    "sectionLabel": "社会责任与公民意识",
    "isRequired": false,
    "categoryId": "regular-category-27",
    "categorySlug": "category-27",
    "categoryTitle": "社会责任与公民意识",
    "sortOrder": 1
  },
  {
    "id": "regular-27-02",
    "slug": "regular-27-02",
    "title": "社会责任与公民意识 Q2",
    "part": "Part 1",
    "prompt": "Why should young people care about society?",
    "followUps": [],
    "tags": [
      "口语素养",
      "社会责任与公民意识"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Young people should care about society because they are part of it and will also shape its future. Social problems, public policies, and community values all affect their lives directly or indirectly. If young people remain indifferent, positive change becomes more difficult. I think caring about society is an important sign of responsibility.",
    "sectionLabel": "社会责任与公民意识",
    "isRequired": false,
    "categoryId": "regular-category-27",
    "categorySlug": "category-27",
    "categoryTitle": "社会责任与公民意识",
    "sortOrder": 2
  },
  {
    "id": "regular-27-03",
    "slug": "regular-27-03",
    "title": "社会责任与公民意识 Q3",
    "part": "Part 1",
    "prompt": "How can students show responsibility as citizens?",
    "followUps": [],
    "tags": [
      "口语素养",
      "社会责任与公民意识"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Students can show responsibility as citizens by following public rules, respecting others, protecting the environment, and participating in helpful activities. They can also stay informed about social issues and develop independent thinking. Small actions, such as being honest and considerate in daily life, are also part of responsible citizenship. In my opinion, responsibility begins with everyday behavior.",
    "sectionLabel": "社会责任与公民意识",
    "isRequired": false,
    "categoryId": "regular-category-27",
    "categorySlug": "category-27",
    "categoryTitle": "社会责任与公民意识",
    "sortOrder": 3
  },
  {
    "id": "regular-27-04",
    "slug": "regular-27-04",
    "title": "社会责任与公民意识 Q4",
    "part": "Part 1",
    "prompt": "Do you think honesty is important in society?",
    "followUps": [],
    "tags": [
      "口语素养",
      "社会责任与公民意识"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Yes, I think honesty is extremely important in society because trust depends on it. Without honesty, relationships, education, and even public systems become weaker. Honest behavior creates a more stable and fair environment for everyone. In my opinion, honesty is one of the most basic but most essential social values.",
    "sectionLabel": "社会责任与公民意识",
    "isRequired": false,
    "categoryId": "regular-category-27",
    "categorySlug": "category-27",
    "categoryTitle": "社会责任与公民意识",
    "sortOrder": 4
  },
  {
    "id": "regular-27-05",
    "slug": "regular-27-05",
    "title": "社会责任与公民意识 Q5",
    "part": "Part 1",
    "prompt": "How can universities help students develop civic awareness?",
    "followUps": [],
    "tags": [
      "口语素养",
      "社会责任与公民意识"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Universities can help students develop civic awareness by encouraging social participation, critical thinking, and responsibility. They can provide courses, discussions, and activities related to public issues and community service. In my opinion, education should not only prepare students for jobs, but also for active and responsible roles in society.",
    "sectionLabel": "社会责任与公民意识",
    "isRequired": false,
    "categoryId": "regular-category-27",
    "categorySlug": "category-27",
    "categoryTitle": "社会责任与公民意识",
    "sortOrder": 5
  },
  {
    "id": "regular-28-01",
    "slug": "regular-28-01",
    "title": "交流能力与沟通技巧 Q1",
    "part": "Part 1",
    "prompt": "Why is communication important?",
    "followUps": [],
    "tags": [
      "口语素养",
      "交流能力与沟通技巧"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Communication is important because it allows people to express ideas, understand others, and build relationships. In study, work, and daily life, many problems come not from bad intentions but from poor communication. Good communication can reduce misunderstanding and improve cooperation. In my opinion, it is one of the most important life skills.",
    "sectionLabel": "交流能力与沟通技巧",
    "isRequired": false,
    "categoryId": "regular-category-28",
    "categorySlug": "category-28",
    "categoryTitle": "交流能力与沟通技巧",
    "sortOrder": 1
  },
  {
    "id": "regular-28-02",
    "slug": "regular-28-02",
    "title": "交流能力与沟通技巧 Q2",
    "part": "Part 1",
    "prompt": "What makes someone a good communicator?",
    "followUps": [],
    "tags": [
      "口语素养",
      "交流能力与沟通技巧"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "A good communicator is someone who can express ideas clearly, listen carefully, and respect other people’s perspectives. Good communication is not only about speaking well, but also about understanding the listener and responding appropriately. In my opinion, patience and empathy are just as important as language ability.",
    "sectionLabel": "交流能力与沟通技巧",
    "isRequired": false,
    "categoryId": "regular-category-28",
    "categorySlug": "category-28",
    "categoryTitle": "交流能力与沟通技巧",
    "sortOrder": 2
  },
  {
    "id": "regular-28-03",
    "slug": "regular-28-03",
    "title": "交流能力与沟通技巧 Q3",
    "part": "Part 1",
    "prompt": "Is listening as important as speaking?",
    "followUps": [],
    "tags": [
      "口语素养",
      "交流能力与沟通技巧"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Yes, I think listening is just as important as speaking. If people only focus on expressing themselves, communication becomes one-sided and less effective. Listening helps people understand the real meaning behind words and respond in a more thoughtful way. In my opinion, good communication always includes both speaking and listening.",
    "sectionLabel": "交流能力与沟通技巧",
    "isRequired": false,
    "categoryId": "regular-category-28",
    "categorySlug": "category-28",
    "categoryTitle": "交流能力与沟通技巧",
    "sortOrder": 3
  },
  {
    "id": "regular-28-04",
    "slug": "regular-28-04",
    "title": "交流能力与沟通技巧 Q4",
    "part": "Part 1",
    "prompt": "How can students improve communication skills?",
    "followUps": [],
    "tags": [
      "口语素养",
      "交流能力与沟通技巧"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Students can improve communication skills by speaking more in real situations, listening actively, and reflecting on their own interactions. Joining discussions, teamwork, and public speaking activities can also help a lot. In addition, students should learn to express themselves clearly and respectfully. Communication improves through practice, not only theory.",
    "sectionLabel": "交流能力与沟通技巧",
    "isRequired": false,
    "categoryId": "regular-category-28",
    "categorySlug": "category-28",
    "categoryTitle": "交流能力与沟通技巧",
    "sortOrder": 4
  },
  {
    "id": "regular-28-05",
    "slug": "regular-28-05",
    "title": "交流能力与沟通技巧 Q5",
    "part": "Part 1",
    "prompt": "Why do misunderstandings happen between people?",
    "followUps": [],
    "tags": [
      "口语素养",
      "交流能力与沟通技巧"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Misunderstandings happen because people may interpret words differently, fail to express themselves clearly, or make assumptions too quickly. Sometimes emotions also affect how messages are received. In my opinion, misunderstandings are common, but they can often be reduced through patience, listening, and honest communication.",
    "sectionLabel": "交流能力与沟通技巧",
    "isRequired": false,
    "categoryId": "regular-category-28",
    "categorySlug": "category-28",
    "categoryTitle": "交流能力与沟通技巧",
    "sortOrder": 5
  },
  {
    "id": "regular-29-01",
    "slug": "regular-29-01",
    "title": "幸福感与生活质量 Q1",
    "part": "Part 1",
    "prompt": "What do you think makes people happy?",
    "followUps": [],
    "tags": [
      "口语素养",
      "幸福感与生活质量"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "I think happiness comes from a combination of meaningful relationships, good health, personal growth, and a sense of purpose. Material comfort is important to some extent, but it is not enough by itself. People usually feel happier when they have emotional support and feel that their life has direction. In my opinion, true happiness is more about balance and inner satisfaction than external success alone.",
    "sectionLabel": "幸福感与生活质量",
    "isRequired": false,
    "categoryId": "regular-category-29",
    "categorySlug": "category-29",
    "categoryTitle": "幸福感与生活质量",
    "sortOrder": 1
  },
  {
    "id": "regular-29-02",
    "slug": "regular-29-02",
    "title": "幸福感与生活质量 Q2",
    "part": "Part 1",
    "prompt": "Is money the key to happiness?",
    "followUps": [],
    "tags": [
      "口语素养",
      "幸福感与生活质量"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "I do not think money is the key to happiness, although it is certainly important. Money can provide security and make life more comfortable, but it cannot guarantee emotional satisfaction or meaningful relationships. Many other factors, such as health, family, and personal fulfillment, are also essential. In my opinion, money is a tool, not the final source of happiness.",
    "sectionLabel": "幸福感与生活质量",
    "isRequired": false,
    "categoryId": "regular-category-29",
    "categorySlug": "category-29",
    "categoryTitle": "幸福感与生活质量",
    "sortOrder": 2
  },
  {
    "id": "regular-29-03",
    "slug": "regular-29-03",
    "title": "幸福感与生活质量 Q3",
    "part": "Part 1",
    "prompt": "How can students improve their quality of life?",
    "followUps": [],
    "tags": [
      "口语素养",
      "幸福感与生活质量"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Students can improve their quality of life by building healthy habits, managing stress well, and keeping a balance between study and rest. They should also maintain supportive relationships and make time for things they enjoy. In my opinion, quality of life is not only about productivity, but also about mental well-being and a sense of stability.",
    "sectionLabel": "幸福感与生活质量",
    "isRequired": false,
    "categoryId": "regular-category-29",
    "categorySlug": "category-29",
    "categoryTitle": "幸福感与生活质量",
    "sortOrder": 3
  },
  {
    "id": "regular-29-04",
    "slug": "regular-29-04",
    "title": "幸福感与生活质量 Q4",
    "part": "Part 1",
    "prompt": "What is the difference between success and happiness?",
    "followUps": [],
    "tags": [
      "口语素养",
      "幸福感与生活质量"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Success usually refers to achievement, results, or recognition, while happiness is more about emotional satisfaction and inner peace. A person can be successful but still feel unhappy, or have a simple life and still feel content. In my opinion, success and happiness are related, but they are not the same. A truly good life should include both meaning and emotional well-being.",
    "sectionLabel": "幸福感与生活质量",
    "isRequired": false,
    "categoryId": "regular-category-29",
    "categorySlug": "category-29",
    "categoryTitle": "幸福感与生活质量",
    "sortOrder": 4
  },
  {
    "id": "regular-29-05",
    "slug": "regular-29-05",
    "title": "幸福感与生活质量 Q5",
    "part": "Part 1",
    "prompt": "Do modern people have more happiness than before?",
    "followUps": [],
    "tags": [
      "口语素养",
      "幸福感与生活质量"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "I think modern people have more convenience and opportunities than before, but that does not automatically mean they are happier. Modern life also brings stress, competition, and information overload. So while living conditions may improve, emotional well-being still depends on how people manage their lives and relationships. In my opinion, happiness is not guaranteed by progress alone.",
    "sectionLabel": "幸福感与生活质量",
    "isRequired": false,
    "categoryId": "regular-category-29",
    "categorySlug": "category-29",
    "categoryTitle": "幸福感与生活质量",
    "sortOrder": 5
  },
  {
    "id": "regular-30-01",
    "slug": "regular-30-01",
    "title": "梦想与个人成长 Q1",
    "part": "Part 1",
    "prompt": "Do you have a dream for the future?",
    "followUps": [],
    "tags": [
      "口语素养",
      "梦想与个人成长"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Yes, I do have dreams for the future. I hope to build a meaningful career, continue improving myself, and become someone who is both capable and confident. My dream is not only about success in work, but also about personal growth and living a life with purpose. I think dreams give people direction and motivation.",
    "sectionLabel": "梦想与个人成长",
    "isRequired": false,
    "categoryId": "regular-category-30",
    "categorySlug": "category-30",
    "categoryTitle": "梦想与个人成长",
    "sortOrder": 1
  },
  {
    "id": "regular-30-02",
    "slug": "regular-30-02",
    "title": "梦想与个人成长 Q2",
    "part": "Part 1",
    "prompt": "Why are dreams important for young people?",
    "followUps": [],
    "tags": [
      "口语素养",
      "梦想与个人成长"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Dreams are important for young people because they provide direction and encourage effort. When people have something they truly want to achieve, they are more likely to work hard and stay motivated during difficult times. Dreams also help young people think about who they want to become. In my opinion, dreams are an important source of energy for growth.",
    "sectionLabel": "梦想与个人成长",
    "isRequired": false,
    "categoryId": "regular-category-30",
    "categorySlug": "category-30",
    "categoryTitle": "梦想与个人成长",
    "sortOrder": 2
  },
  {
    "id": "regular-30-03",
    "slug": "regular-30-03",
    "title": "梦想与个人成长 Q3",
    "part": "Part 1",
    "prompt": "Can people grow without facing difficulties?",
    "followUps": [],
    "tags": [
      "口语素养",
      "梦想与个人成长"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "I do not think people can grow fully without facing difficulties. Challenges often teach lessons that comfort cannot teach, such as patience, resilience, and self-awareness. Although difficulties are unpleasant, they often help people become stronger and wiser. In my opinion, growth usually comes from how people respond to challenges.",
    "sectionLabel": "梦想与个人成长",
    "isRequired": false,
    "categoryId": "regular-category-30",
    "categorySlug": "category-30",
    "categoryTitle": "梦想与个人成长",
    "sortOrder": 3
  },
  {
    "id": "regular-30-04",
    "slug": "regular-30-04",
    "title": "梦想与个人成长 Q4",
    "part": "Part 1",
    "prompt": "What does personal growth mean to you?",
    "followUps": [],
    "tags": [
      "口语素养",
      "梦想与个人成长"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "To me, personal growth means becoming a better version of myself over time. It includes improving my abilities, understanding myself more clearly, and learning how to face life with greater maturity. Personal growth is not something that happens suddenly; it is usually the result of many small efforts and experiences. I think it is a lifelong process.",
    "sectionLabel": "梦想与个人成长",
    "isRequired": false,
    "categoryId": "regular-category-30",
    "categorySlug": "category-30",
    "categoryTitle": "梦想与个人成长",
    "sortOrder": 4
  },
  {
    "id": "regular-30-05",
    "slug": "regular-30-05",
    "title": "梦想与个人成长 Q5",
    "part": "Part 1",
    "prompt": "How can students continue improving themselves?",
    "followUps": [],
    "tags": [
      "口语素养",
      "梦想与个人成长"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Students can continue improving themselves by staying curious, setting goals, and reflecting on their progress regularly. They should be willing to learn from both success and failure. It is also important to develop good habits, seek feedback, and remain open to new experiences. In my opinion, self-improvement begins with awareness and continues through action.",
    "sectionLabel": "梦想与个人成长",
    "isRequired": false,
    "categoryId": "regular-category-30",
    "categorySlug": "category-30",
    "categoryTitle": "梦想与个人成长",
    "sortOrder": 5
  },
  {
    "id": "regular-31-01",
    "slug": "regular-31-01",
    "title": "网络购物 Q1",
    "part": "Part 1",
    "prompt": "What do you think of online shopping?",
    "followUps": [],
    "tags": [
      "口语素养",
      "网络购物"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "I think online shopping is very convenient and has become an important part of modern life. People can compare prices, read reviews, and buy things without leaving home. This saves a lot of time and effort, especially for busy students and workers. However, online shopping also has some disadvantages, such as impulsive buying and uncertainty about product quality. In my opinion, it is useful as long as people shop carefully and responsibly.",
    "sectionLabel": "网络购物",
    "isRequired": false,
    "categoryId": "regular-category-31",
    "categorySlug": "category-31",
    "categoryTitle": "网络购物",
    "sortOrder": 1
  },
  {
    "id": "regular-31-02",
    "slug": "regular-31-02",
    "title": "网络购物 Q2",
    "part": "Part 1",
    "prompt": "What are the advantages of online shopping?",
    "followUps": [],
    "tags": [
      "口语素养",
      "网络购物"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "The biggest advantage of online shopping is convenience. People can shop anytime and anywhere, and they usually have more choices than in physical stores. It is also easier to compare prices and find discounts online. In addition, customer reviews can help buyers make better decisions. I think these advantages explain why online shopping is so popular today.",
    "sectionLabel": "网络购物",
    "isRequired": false,
    "categoryId": "regular-category-31",
    "categorySlug": "category-31",
    "categoryTitle": "网络购物",
    "sortOrder": 2
  },
  {
    "id": "regular-31-03",
    "slug": "regular-31-03",
    "title": "网络购物 Q3",
    "part": "Part 1",
    "prompt": "What are the disadvantages of online shopping?",
    "followUps": [],
    "tags": [
      "口语素养",
      "网络购物"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "One disadvantage of online shopping is that people cannot see or try the product before buying it. This sometimes leads to disappointment when the item arrives and does not match expectations. Another problem is that online shopping can encourage unnecessary spending because buying is so easy. There are also risks related to fraud or poor customer service. So I think online shopping should be used with caution.",
    "sectionLabel": "网络购物",
    "isRequired": false,
    "categoryId": "regular-category-31",
    "categorySlug": "category-31",
    "categoryTitle": "网络购物",
    "sortOrder": 3
  },
  {
    "id": "regular-31-04",
    "slug": "regular-31-04",
    "title": "网络购物 Q4",
    "part": "Part 1",
    "prompt": "Do you prefer online shopping or shopping in stores?",
    "followUps": [],
    "tags": [
      "口语素养",
      "网络购物"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "I think both have their own advantages, but I usually prefer online shopping for convenience. It is especially useful when I need to save time or compare different options quickly. However, for certain products, such as clothes or items where quality matters a lot, I still think shopping in stores is better because I can check them directly. So my preference depends on the situation.",
    "sectionLabel": "网络购物",
    "isRequired": false,
    "categoryId": "regular-category-31",
    "categorySlug": "category-31",
    "categoryTitle": "网络购物",
    "sortOrder": 4
  },
  {
    "id": "regular-31-05",
    "slug": "regular-31-05",
    "title": "网络购物 Q5",
    "part": "Part 1",
    "prompt": "How has online shopping changed people’s habits?",
    "followUps": [],
    "tags": [
      "口语素养",
      "网络购物"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Online shopping has changed people’s habits by making consumption faster and more convenient. People now spend less time going to physical stores and more time browsing products on their phones or computers. It has also made price comparison easier and increased the influence of reviews and social media on buying decisions. In my opinion, online shopping has made daily life more efficient, but it has also made self-control more important.",
    "sectionLabel": "网络购物",
    "isRequired": false,
    "categoryId": "regular-category-31",
    "categorySlug": "category-31",
    "categoryTitle": "网络购物",
    "sortOrder": 5
  },
  {
    "id": "regular-32-01",
    "slug": "regular-32-01",
    "title": "语言学习 Q1",
    "part": "Part 1",
    "prompt": "Why is learning a foreign language important?",
    "followUps": [],
    "tags": [
      "口语素养",
      "语言学习"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Learning a foreign language is important because it helps people communicate with a wider range of people and understand different cultures. In today’s globalized world, language skills can also improve study and career opportunities. For students, learning a foreign language can develop patience, memory, and communication ability. In my opinion, language learning is not only practical, but also enriching on a personal level.",
    "sectionLabel": "语言学习",
    "isRequired": false,
    "categoryId": "regular-category-32",
    "categorySlug": "category-32",
    "categoryTitle": "语言学习",
    "sortOrder": 1
  },
  {
    "id": "regular-32-02",
    "slug": "regular-32-02",
    "title": "语言学习 Q2",
    "part": "Part 1",
    "prompt": "What is the best way to improve spoken English?",
    "followUps": [],
    "tags": [
      "口语素养",
      "语言学习"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "I think the best way to improve spoken English is to practice regularly in real or realistic situations. Speaking more often helps people become more confident and natural. It is also useful to listen to English materials, learn common expressions, and pay attention to pronunciation and rhythm. In my opinion, improvement comes from active use, not only from memorizing vocabulary or grammar.",
    "sectionLabel": "语言学习",
    "isRequired": false,
    "categoryId": "regular-category-32",
    "categorySlug": "category-32",
    "categoryTitle": "语言学习",
    "sortOrder": 2
  },
  {
    "id": "regular-32-03",
    "slug": "regular-32-03",
    "title": "语言学习 Q3",
    "part": "Part 1",
    "prompt": "What difficulties do students face in language learning?",
    "followUps": [],
    "tags": [
      "口语素养",
      "语言学习"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Students often face difficulties such as limited vocabulary, lack of confidence, pronunciation problems, and fear of making mistakes. Some students may also lose motivation if they do not see progress quickly. In addition, language learning requires long-term effort, which can be challenging in a busy academic life. I think the key is to stay patient and keep practicing step by step.",
    "sectionLabel": "语言学习",
    "isRequired": false,
    "categoryId": "regular-category-32",
    "categorySlug": "category-32",
    "categoryTitle": "语言学习",
    "sortOrder": 3
  },
  {
    "id": "regular-32-04",
    "slug": "regular-32-04",
    "title": "语言学习 Q4",
    "part": "Part 1",
    "prompt": "Do you think making mistakes is a normal part of learning a language?",
    "followUps": [],
    "tags": [
      "口语素养",
      "语言学习"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Yes, I think making mistakes is a completely normal part of learning a language. Mistakes show that a person is trying to use the language actively, which is necessary for improvement. If students are too afraid of making mistakes, they may become silent and lose opportunities to practice. In my opinion, mistakes should be seen as part of progress rather than something embarrassing.",
    "sectionLabel": "语言学习",
    "isRequired": false,
    "categoryId": "regular-category-32",
    "categorySlug": "category-32",
    "categoryTitle": "语言学习",
    "sortOrder": 4
  },
  {
    "id": "regular-32-05",
    "slug": "regular-32-05",
    "title": "语言学习 Q5",
    "part": "Part 1",
    "prompt": "How can technology help people learn languages?",
    "followUps": [],
    "tags": [
      "口语素养",
      "语言学习"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Technology can help people learn languages in many ways. For example, learners can use apps, online courses, videos, dictionaries, and AI tools to practice listening, speaking, reading, and writing. Technology also makes learning more flexible because people can study anytime and anywhere. In my opinion, technology is a very helpful support, especially when it is combined with regular practice and motivation.",
    "sectionLabel": "语言学习",
    "isRequired": false,
    "categoryId": "regular-category-32",
    "categorySlug": "category-32",
    "categoryTitle": "语言学习",
    "sortOrder": 5
  },
  {
    "id": "regular-33-01",
    "slug": "regular-33-01",
    "title": "宠物与动物 Q1",
    "part": "Part 1",
    "prompt": "Do you like animals? Why or why not?",
    "followUps": [],
    "tags": [
      "口语素养",
      "宠物与动物"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Yes, I like animals because they are interesting, lively, and often make people feel relaxed. Many animals also show simple and sincere emotions, which can be comforting. I think animals make the world more diverse and bring joy to human life. In my opinion, caring about animals also reflects kindness and respect for life.",
    "sectionLabel": "宠物与动物",
    "isRequired": false,
    "categoryId": "regular-category-33",
    "categorySlug": "category-33",
    "categoryTitle": "宠物与动物",
    "sortOrder": 1
  },
  {
    "id": "regular-33-02",
    "slug": "regular-33-02",
    "title": "宠物与动物 Q2",
    "part": "Part 1",
    "prompt": "Why do some people keep pets?",
    "followUps": [],
    "tags": [
      "口语素养",
      "宠物与动物"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Some people keep pets because pets can provide companionship, comfort, and happiness. For many people, pets are like family members because they offer emotional support and reduce loneliness. Taking care of a pet can also teach responsibility and patience. I think this is why pets are so important to many people.",
    "sectionLabel": "宠物与动物",
    "isRequired": false,
    "categoryId": "regular-category-33",
    "categorySlug": "category-33",
    "categoryTitle": "宠物与动物",
    "sortOrder": 2
  },
  {
    "id": "regular-33-03",
    "slug": "regular-33-03",
    "title": "宠物与动物 Q3",
    "part": "Part 1",
    "prompt": "What can people learn from taking care of animals?",
    "followUps": [],
    "tags": [
      "口语素养",
      "宠物与动物"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "People can learn many things from taking care of animals, such as patience, responsibility, and empathy. Looking after an animal requires regular attention and understanding of its needs. This can help people become more careful and compassionate. In my opinion, caring for animals can improve a person’s character in a meaningful way.",
    "sectionLabel": "宠物与动物",
    "isRequired": false,
    "categoryId": "regular-category-33",
    "categorySlug": "category-33",
    "categoryTitle": "宠物与动物",
    "sortOrder": 3
  },
  {
    "id": "regular-33-04",
    "slug": "regular-33-04",
    "title": "宠物与动物 Q4",
    "part": "Part 1",
    "prompt": "Do you think zoos are good or bad?",
    "followUps": [],
    "tags": [
      "口语素养",
      "宠物与动物"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "I think zoos can have both positive and negative sides. On the positive side, they can help protect endangered animals and educate the public about wildlife. On the negative side, some zoos may not provide animals with a natural or comfortable environment. In my opinion, whether zoos are good depends on how responsibly they are managed.",
    "sectionLabel": "宠物与动物",
    "isRequired": false,
    "categoryId": "regular-category-33",
    "categorySlug": "category-33",
    "categoryTitle": "宠物与动物",
    "sortOrder": 4
  },
  {
    "id": "regular-33-05",
    "slug": "regular-33-05",
    "title": "宠物与动物 Q5",
    "part": "Part 1",
    "prompt": "Should people do more to protect wild animals?",
    "followUps": [],
    "tags": [
      "口语素养",
      "宠物与动物"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Yes, I think people should definitely do more to protect wild animals. Many species are threatened by habitat destruction, pollution, and illegal hunting. Protecting wild animals is important not only for nature, but also for the balance of the whole ecosystem. In my opinion, wildlife protection is a shared responsibility for society.",
    "sectionLabel": "宠物与动物",
    "isRequired": false,
    "categoryId": "regular-category-33",
    "categorySlug": "category-33",
    "categoryTitle": "宠物与动物",
    "sortOrder": 5
  },
  {
    "id": "regular-34-01",
    "slug": "regular-34-01",
    "title": "天气与气候 Q1",
    "part": "Part 1",
    "prompt": "What kind of weather do you like most?",
    "followUps": [],
    "tags": [
      "口语素养",
      "天气与气候"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "I like mild and comfortable weather the most, especially when it is not too hot or too cold. This kind of weather makes people feel relaxed and makes daily activities more enjoyable. It is also easier to study, go outside, and keep a good mood in pleasant weather. In my opinion, weather can influence both comfort and productivity.",
    "sectionLabel": "天气与气候",
    "isRequired": false,
    "categoryId": "regular-category-34",
    "categorySlug": "category-34",
    "categoryTitle": "天气与气候",
    "sortOrder": 1
  },
  {
    "id": "regular-34-02",
    "slug": "regular-34-02",
    "title": "天气与气候 Q2",
    "part": "Part 1",
    "prompt": "How does weather affect people’s mood?",
    "followUps": [],
    "tags": [
      "口语素养",
      "天气与气候"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Weather can affect people’s mood quite strongly. Sunny weather often makes people feel more energetic and positive, while long periods of rain or cold weather may make some people feel tired or less motivated. Of course, the effect is different for different people. In my opinion, weather is one of the small but important factors in daily emotional experience.",
    "sectionLabel": "天气与气候",
    "isRequired": false,
    "categoryId": "regular-category-34",
    "categorySlug": "category-34",
    "categoryTitle": "天气与气候",
    "sortOrder": 2
  },
  {
    "id": "regular-34-03",
    "slug": "regular-34-03",
    "title": "天气与气候 Q3",
    "part": "Part 1",
    "prompt": "Do you think climate change is a serious problem?",
    "followUps": [],
    "tags": [
      "口语素养",
      "天气与气候"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Yes, I think climate change is a very serious problem because it affects the environment, the economy, and people’s daily lives. Rising temperatures, extreme weather, and environmental damage can create long-term risks for many countries. In my opinion, climate change is not just a scientific issue, but also a social responsibility that requires action.",
    "sectionLabel": "天气与气候",
    "isRequired": false,
    "categoryId": "regular-category-34",
    "categorySlug": "category-34",
    "categoryTitle": "天气与气候",
    "sortOrder": 3
  },
  {
    "id": "regular-34-04",
    "slug": "regular-34-04",
    "title": "天气与气候 Q4",
    "part": "Part 1",
    "prompt": "How can people deal with extreme weather?",
    "followUps": [],
    "tags": [
      "口语素养",
      "天气与气候"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "People can deal with extreme weather by staying informed, preparing in advance, and following safety advice. For example, they can check weather forecasts, keep necessary supplies, and avoid dangerous activities when conditions are bad. Governments and communities also play an important role in emergency preparation. I think awareness and planning are the keys to reducing risk.",
    "sectionLabel": "天气与气候",
    "isRequired": false,
    "categoryId": "regular-category-34",
    "categorySlug": "category-34",
    "categoryTitle": "天气与气候",
    "sortOrder": 4
  },
  {
    "id": "regular-34-05",
    "slug": "regular-34-05",
    "title": "天气与气候 Q5",
    "part": "Part 1",
    "prompt": "Why should students learn about climate issues?",
    "followUps": [],
    "tags": [
      "口语素养",
      "天气与气候"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Students should learn about climate issues because they will live in a future that is strongly affected by environmental change. Understanding climate problems can help them develop responsibility and make better choices in daily life. It can also encourage innovation and long-term thinking. In my opinion, climate education is very important for the next generation.",
    "sectionLabel": "天气与气候",
    "isRequired": false,
    "categoryId": "regular-category-34",
    "categorySlug": "category-34",
    "categoryTitle": "天气与气候",
    "sortOrder": 5
  },
  {
    "id": "regular-35-01",
    "slug": "regular-35-01",
    "title": "自律与习惯养成 Q1",
    "part": "Part 1",
    "prompt": "Why is self-discipline important?",
    "followUps": [],
    "tags": [
      "口语素养",
      "自律与习惯养成"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Self-discipline is important because it helps people stay focused on their goals and complete tasks even when they do not feel motivated. Many good results in life come from consistent effort rather than temporary enthusiasm. Self-discipline also helps people manage time better and avoid unnecessary distractions. In my opinion, it is one of the most important qualities for personal success.",
    "sectionLabel": "自律与习惯养成",
    "isRequired": false,
    "categoryId": "regular-category-35",
    "categorySlug": "category-35",
    "categoryTitle": "自律与习惯养成",
    "sortOrder": 1
  },
  {
    "id": "regular-35-02",
    "slug": "regular-35-02",
    "title": "自律与习惯养成 Q2",
    "part": "Part 1",
    "prompt": "How can students build good habits?",
    "followUps": [],
    "tags": [
      "口语素养",
      "自律与习惯养成"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Students can build good habits by starting with small and realistic goals. It is easier to keep a habit when it fits naturally into daily life and does not feel too difficult at the beginning. Consistency is more important than doing something perfectly. In my opinion, good habits are formed through repetition, patience, and self-awareness.",
    "sectionLabel": "自律与习惯养成",
    "isRequired": false,
    "categoryId": "regular-category-35",
    "categorySlug": "category-35",
    "categoryTitle": "自律与习惯养成",
    "sortOrder": 2
  },
  {
    "id": "regular-35-03",
    "slug": "regular-35-03",
    "title": "自律与习惯养成 Q3",
    "part": "Part 1",
    "prompt": "What bad habits do students often have?",
    "followUps": [],
    "tags": [
      "口语素养",
      "自律与习惯养成"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Students often have bad habits such as procrastination, staying up too late, spending too much time on their phones, and not planning their tasks well. These habits may seem small, but over time they can affect study performance and health. I think the first step to improvement is recognizing these habits honestly.",
    "sectionLabel": "自律与习惯养成",
    "isRequired": false,
    "categoryId": "regular-category-35",
    "categorySlug": "category-35",
    "categoryTitle": "自律与习惯养成",
    "sortOrder": 3
  },
  {
    "id": "regular-35-04",
    "slug": "regular-35-04",
    "title": "自律与习惯养成 Q4",
    "part": "Part 1",
    "prompt": "Is motivation enough to achieve success?",
    "followUps": [],
    "tags": [
      "口语素养",
      "自律与习惯养成"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "I do not think motivation alone is enough to achieve success. Motivation can help people start, but self-discipline and persistence are what help them continue, especially during difficult times. Many people feel inspired at first, but real progress requires consistent action. In my opinion, motivation is helpful, but discipline is more reliable in the long term.",
    "sectionLabel": "自律与习惯养成",
    "isRequired": false,
    "categoryId": "regular-category-35",
    "categorySlug": "category-35",
    "categoryTitle": "自律与习惯养成",
    "sortOrder": 4
  },
  {
    "id": "regular-35-05",
    "slug": "regular-35-05",
    "title": "自律与习惯养成 Q5",
    "part": "Part 1",
    "prompt": "What habit would you most like to improve?",
    "followUps": [],
    "tags": [
      "口语素养",
      "自律与习惯养成"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "One habit I would most like to improve is managing my time more consistently. Sometimes I know what I should do, but I do not always follow the best plan. If I can develop stronger self-discipline in daily routines, I think I will be more productive and less stressed. Improving one habit can often influence many other parts of life in a positive way.",
    "sectionLabel": "自律与习惯养成",
    "isRequired": false,
    "categoryId": "regular-category-35",
    "categorySlug": "category-35",
    "categoryTitle": "自律与习惯养成",
    "sortOrder": 5
  },
  {
    "id": "regular-36-01",
    "slug": "regular-36-01",
    "title": "偶像与榜样 Q1",
    "part": "Part 1",
    "prompt": "Do you think young people need role models?",
    "followUps": [],
    "tags": [
      "口语素养",
      "偶像与榜样"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Yes, I think young people do need role models because role models can provide inspiration, direction, and positive examples. At an important stage of growth, many young people are still shaping their values and goals. Seeing someone with admirable qualities can encourage them to work harder and think more seriously about their future. In my opinion, good role models can have a strong positive influence.",
    "sectionLabel": "偶像与榜样",
    "isRequired": false,
    "categoryId": "regular-category-36",
    "categorySlug": "category-36",
    "categoryTitle": "偶像与榜样",
    "sortOrder": 1
  },
  {
    "id": "regular-36-02",
    "slug": "regular-36-02",
    "title": "偶像与榜样 Q2",
    "part": "Part 1",
    "prompt": "What qualities make someone a good role model?",
    "followUps": [],
    "tags": [
      "口语素养",
      "偶像与榜样"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "A good role model should have qualities such as responsibility, honesty, perseverance, and respect for others. It is not necessary for them to be perfect, but they should show values that are worth learning from. In my opinion, the best role models are people whose actions match their words.",
    "sectionLabel": "偶像与榜样",
    "isRequired": false,
    "categoryId": "regular-category-36",
    "categorySlug": "category-36",
    "categoryTitle": "偶像与榜样",
    "sortOrder": 2
  },
  {
    "id": "regular-36-03",
    "slug": "regular-36-03",
    "title": "偶像与榜样 Q3",
    "part": "Part 1",
    "prompt": "Can ordinary people be role models?",
    "followUps": [],
    "tags": [
      "口语素养",
      "偶像与榜样"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Yes, ordinary people can definitely be role models. A role model does not have to be famous. Parents, teachers, classmates, or friends can all become role models if they show admirable qualities and positive attitudes. In my opinion, people in daily life often influence us more deeply than public figures.",
    "sectionLabel": "偶像与榜样",
    "isRequired": false,
    "categoryId": "regular-category-36",
    "categorySlug": "category-36",
    "categoryTitle": "偶像与榜样",
    "sortOrder": 3
  },
  {
    "id": "regular-36-04",
    "slug": "regular-36-04",
    "title": "偶像与榜样 Q4",
    "part": "Part 1",
    "prompt": "Should students admire celebrities?",
    "followUps": [],
    "tags": [
      "口语素养",
      "偶像与榜样"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "I think students can admire celebrities, but they should do so in a rational way. Some celebrities may be hardworking and talented, which can be inspiring. However, students should not copy everything they see or treat fame as the same as good character. In my opinion, admiration should be based on values and behavior, not only popularity.",
    "sectionLabel": "偶像与榜样",
    "isRequired": false,
    "categoryId": "regular-category-36",
    "categorySlug": "category-36",
    "categoryTitle": "偶像与榜样",
    "sortOrder": 4
  },
  {
    "id": "regular-36-05",
    "slug": "regular-36-05",
    "title": "偶像与榜样 Q5",
    "part": "Part 1",
    "prompt": "Who has influenced you the most in your life?",
    "followUps": [],
    "tags": [
      "口语素养",
      "偶像与榜样"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "The person who has influenced me the most is someone who has supported me, encouraged me, and taught me important values through both words and actions. This influence is important because it has shaped the way I think about responsibility, growth, and dealing with difficulties. In my opinion, the people closest to us often have the deepest influence on our character.",
    "sectionLabel": "偶像与榜样",
    "isRequired": false,
    "categoryId": "regular-category-36",
    "categorySlug": "category-36",
    "categoryTitle": "偶像与榜样",
    "sortOrder": 5
  },
  {
    "id": "regular-37-01",
    "slug": "regular-37-01",
    "title": "创新与创造力 Q1",
    "part": "Part 1",
    "prompt": "Why is creativity important?",
    "followUps": [],
    "tags": [
      "口语素养",
      "创新与创造力"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Creativity is important because it helps people think in new ways and find original solutions to problems. In modern society, many challenges cannot be solved only by following old methods. Creativity is useful not only in art, but also in science, technology, education, and daily life. In my opinion, creativity makes progress possible.",
    "sectionLabel": "创新与创造力",
    "isRequired": false,
    "categoryId": "regular-category-37",
    "categorySlug": "category-37",
    "categoryTitle": "创新与创造力",
    "sortOrder": 1
  },
  {
    "id": "regular-37-02",
    "slug": "regular-37-02",
    "title": "创新与创造力 Q2",
    "part": "Part 1",
    "prompt": "Can creativity be developed?",
    "followUps": [],
    "tags": [
      "口语素养",
      "创新与创造力"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Yes, I believe creativity can be developed. Although some people may naturally be more imaginative, creativity also grows through practice, curiosity, and exposure to different ideas. When people are encouraged to think independently and try new approaches, their creativity becomes stronger. In my opinion, it is a skill that can be trained over time.",
    "sectionLabel": "创新与创造力",
    "isRequired": false,
    "categoryId": "regular-category-37",
    "categorySlug": "category-37",
    "categoryTitle": "创新与创造力",
    "sortOrder": 2
  },
  {
    "id": "regular-37-03",
    "slug": "regular-37-03",
    "title": "创新与创造力 Q3",
    "part": "Part 1",
    "prompt": "How can schools encourage innovation?",
    "followUps": [],
    "tags": [
      "口语素养",
      "创新与创造力"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Schools can encourage innovation by creating an environment where students feel free to ask questions, explore ideas, and learn from mistakes. Instead of focusing only on standard answers, schools should also value independent thinking and practical problem solving. In my opinion, innovation develops best when students have both guidance and freedom.",
    "sectionLabel": "创新与创造力",
    "isRequired": false,
    "categoryId": "regular-category-37",
    "categorySlug": "category-37",
    "categoryTitle": "创新与创造力",
    "sortOrder": 3
  },
  {
    "id": "regular-37-04",
    "slug": "regular-37-04",
    "title": "创新与创造力 Q4",
    "part": "Part 1",
    "prompt": "Is technology helpful for creative work?",
    "followUps": [],
    "tags": [
      "口语素养",
      "创新与创造力"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Yes, technology can be very helpful for creative work because it provides tools that make it easier to design, test, edit, and share ideas. It can also save time and allow people to experiment more efficiently. However, technology itself does not replace imagination. In my opinion, it is most valuable when it supports human creativity rather than replacing it.",
    "sectionLabel": "创新与创造力",
    "isRequired": false,
    "categoryId": "regular-category-37",
    "categorySlug": "category-37",
    "categoryTitle": "创新与创造力",
    "sortOrder": 4
  },
  {
    "id": "regular-37-05",
    "slug": "regular-37-05",
    "title": "创新与创造力 Q5",
    "part": "Part 1",
    "prompt": "Do you enjoy solving problems in new ways?",
    "followUps": [],
    "tags": [
      "口语素养",
      "创新与创造力"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Yes, I do enjoy solving problems in new ways because it makes the process more interesting and meaningful. Finding a creative solution often requires deeper thinking and gives a stronger sense of achievement. In my opinion, trying new methods is a good way to learn and grow, even if the first attempt is not perfect.",
    "sectionLabel": "创新与创造力",
    "isRequired": false,
    "categoryId": "regular-category-37",
    "categorySlug": "category-37",
    "categoryTitle": "创新与创造力",
    "sortOrder": 5
  },
  {
    "id": "regular-38-01",
    "slug": "regular-38-01",
    "title": "规则与自由 Q1",
    "part": "Part 1",
    "prompt": "Why do societies need rules?",
    "followUps": [],
    "tags": [
      "口语素养",
      "规则与自由"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Societies need rules because rules help maintain order, fairness, and safety. Without rules, people might act only according to personal interests, which could create conflict and confusion. Rules provide a shared standard for behavior and make cooperation possible. In my opinion, rules are necessary for a stable society.",
    "sectionLabel": "规则与自由",
    "isRequired": false,
    "categoryId": "regular-category-38",
    "categorySlug": "category-38",
    "categoryTitle": "规则与自由",
    "sortOrder": 1
  },
  {
    "id": "regular-38-02",
    "slug": "regular-38-02",
    "title": "规则与自由 Q2",
    "part": "Part 1",
    "prompt": "Do rules limit freedom?",
    "followUps": [],
    "tags": [
      "口语素养",
      "规则与自由"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "I think rules can limit some forms of freedom, but that does not mean they are always negative. In many cases, rules actually protect freedom by preventing harmful behavior and ensuring fairness for everyone. The key is whether the rules are reasonable and well designed. In my opinion, freedom without any rules would become disorder.",
    "sectionLabel": "规则与自由",
    "isRequired": false,
    "categoryId": "regular-category-38",
    "categorySlug": "category-38",
    "categoryTitle": "规则与自由",
    "sortOrder": 2
  },
  {
    "id": "regular-38-03",
    "slug": "regular-38-03",
    "title": "规则与自由 Q3",
    "part": "Part 1",
    "prompt": "What school rules are most important?",
    "followUps": [],
    "tags": [
      "口语素养",
      "规则与自由"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "The most important school rules are those that protect respect, safety, and a good learning environment. For example, rules against cheating, bullying, and serious disruption are essential. These rules help students learn fairly and feel secure. In my opinion, school rules should guide behavior rather than simply control it.",
    "sectionLabel": "规则与自由",
    "isRequired": false,
    "categoryId": "regular-category-38",
    "categorySlug": "category-38",
    "categoryTitle": "规则与自由",
    "sortOrder": 3
  },
  {
    "id": "regular-38-04",
    "slug": "regular-38-04",
    "title": "规则与自由 Q4",
    "part": "Part 1",
    "prompt": "Should students be given more freedom at university?",
    "followUps": [],
    "tags": [
      "口语素养",
      "规则与自由"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Yes, I think students should be given more freedom at university because university is an important stage for developing independence and responsibility. Students need space to make choices and learn from experience. However, freedom should come together with self-discipline and respect for others. In my opinion, greater freedom is useful when students are also expected to act responsibly.",
    "sectionLabel": "规则与自由",
    "isRequired": false,
    "categoryId": "regular-category-38",
    "categorySlug": "category-38",
    "categoryTitle": "规则与自由",
    "sortOrder": 4
  },
  {
    "id": "regular-38-05",
    "slug": "regular-38-05",
    "title": "规则与自由 Q5",
    "part": "Part 1",
    "prompt": "How can people balance freedom and responsibility?",
    "followUps": [],
    "tags": [
      "口语素养",
      "规则与自由"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "People can balance freedom and responsibility by understanding that personal choices always affect others in some way. Freedom should allow people to develop themselves, but it should not harm other people or ignore shared rules. In my opinion, true freedom includes the ability to make wise and responsible decisions.",
    "sectionLabel": "规则与自由",
    "isRequired": false,
    "categoryId": "regular-category-38",
    "categorySlug": "category-38",
    "categoryTitle": "规则与自由",
    "sortOrder": 5
  },
  {
    "id": "regular-39-01",
    "slug": "regular-39-01",
    "title": "人工智能伦理 Q1",
    "part": "Part 1",
    "prompt": "Do you think AI ethics is important?",
    "followUps": [],
    "tags": [
      "口语素养",
      "人工智能伦理"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Yes, I think AI ethics is extremely important because artificial intelligence can influence many areas of life, such as education, healthcare, business, and public decision making. If AI is used without ethical principles, it may cause unfairness, privacy problems, or harmful consequences. In my opinion, technology should develop together with ethical responsibility.",
    "sectionLabel": "人工智能伦理",
    "isRequired": false,
    "categoryId": "regular-category-39",
    "categorySlug": "category-39",
    "categoryTitle": "人工智能伦理",
    "sortOrder": 1
  },
  {
    "id": "regular-39-02",
    "slug": "regular-39-02",
    "title": "人工智能伦理 Q2",
    "part": "Part 1",
    "prompt": "What ethical problems can AI create?",
    "followUps": [],
    "tags": [
      "口语素养",
      "人工智能伦理"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "AI can create ethical problems such as bias, privacy violations, misinformation, and overdependence on automated systems. If an AI system is trained on unfair data, it may produce unfair results. There is also the risk that people may trust AI too much without checking its decisions. In my opinion, these problems show why careful regulation and human oversight are necessary.",
    "sectionLabel": "人工智能伦理",
    "isRequired": false,
    "categoryId": "regular-category-39",
    "categorySlug": "category-39",
    "categoryTitle": "人工智能伦理",
    "sortOrder": 2
  },
  {
    "id": "regular-39-03",
    "slug": "regular-39-03",
    "title": "人工智能伦理 Q3",
    "part": "Part 1",
    "prompt": "Should humans always make the final decision?",
    "followUps": [],
    "tags": [
      "口语素养",
      "人工智能伦理"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "I think in many important situations, humans should still make the final decision. AI can provide support, analysis, and suggestions, but decisions involving ethics, responsibility, or human well-being should not be left entirely to machines. In my opinion, human judgment remains essential, especially in sensitive areas.",
    "sectionLabel": "人工智能伦理",
    "isRequired": false,
    "categoryId": "regular-category-39",
    "categorySlug": "category-39",
    "categoryTitle": "人工智能伦理",
    "sortOrder": 3
  },
  {
    "id": "regular-39-04",
    "slug": "regular-39-04",
    "title": "人工智能伦理 Q4",
    "part": "Part 1",
    "prompt": "How can AI be used responsibly?",
    "followUps": [],
    "tags": [
      "口语素养",
      "人工智能伦理"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "AI can be used responsibly when people make its goals clear, check its results carefully, and ensure transparency and fairness. It is also important to protect privacy and avoid using AI in harmful or dishonest ways. In my opinion, responsible use of AI requires both technical skill and strong values.",
    "sectionLabel": "人工智能伦理",
    "isRequired": false,
    "categoryId": "regular-category-39",
    "categorySlug": "category-39",
    "categoryTitle": "人工智能伦理",
    "sortOrder": 4
  },
  {
    "id": "regular-39-05",
    "slug": "regular-39-05",
    "title": "人工智能伦理 Q5",
    "part": "Part 1",
    "prompt": "Should students learn about AI ethics?",
    "followUps": [],
    "tags": [
      "口语素养",
      "人工智能伦理"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Yes, students should definitely learn about AI ethics because AI is becoming more common in education, work, and everyday life. If students understand the ethical side of technology, they will be better prepared to use it wisely and critically. In my opinion, AI education should include not only tools and skills, but also ethics and responsibility.",
    "sectionLabel": "人工智能伦理",
    "isRequired": false,
    "categoryId": "regular-category-39",
    "categorySlug": "category-39",
    "categoryTitle": "人工智能伦理",
    "sortOrder": 5
  },
  {
    "id": "regular-40-01",
    "slug": "regular-40-01",
    "title": "校园安全 Q1",
    "part": "Part 1",
    "prompt": "Why is campus safety important?",
    "followUps": [],
    "tags": [
      "口语素养",
      "校园安全"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Campus safety is important because students can only study and live well when they feel secure. A safe campus environment protects physical well-being and also supports mental comfort. Without safety, students may feel anxious and unable to focus on their goals. In my opinion, campus safety is one of the foundations of a healthy educational environment.",
    "sectionLabel": "校园安全",
    "isRequired": false,
    "categoryId": "regular-category-40",
    "categorySlug": "category-40",
    "categoryTitle": "校园安全",
    "sortOrder": 1
  },
  {
    "id": "regular-40-02",
    "slug": "regular-40-02",
    "title": "校园安全 Q2",
    "part": "Part 1",
    "prompt": "What can schools do to improve safety?",
    "followUps": [],
    "tags": [
      "口语素养",
      "校园安全"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Schools can improve safety by strengthening management, maintaining campus facilities, providing clear emergency procedures, and educating students about safety awareness. They should also pay attention to both physical safety and psychological well-being. In my opinion, safety work should be proactive rather than only reactive.",
    "sectionLabel": "校园安全",
    "isRequired": false,
    "categoryId": "regular-category-40",
    "categorySlug": "category-40",
    "categoryTitle": "校园安全",
    "sortOrder": 2
  },
  {
    "id": "regular-40-03",
    "slug": "regular-40-03",
    "title": "校园安全 Q3",
    "part": "Part 1",
    "prompt": "What safety problems might students face on campus?",
    "followUps": [],
    "tags": [
      "口语素养",
      "校园安全"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Students may face different safety problems on campus, such as traffic risks, dormitory safety issues, online fraud, or mental health pressure. Some risks are physical, while others are related to information or emotional well-being. In my opinion, students should be aware of these problems and know how to respond appropriately.",
    "sectionLabel": "校园安全",
    "isRequired": false,
    "categoryId": "regular-category-40",
    "categorySlug": "category-40",
    "categoryTitle": "校园安全",
    "sortOrder": 3
  },
  {
    "id": "regular-40-04",
    "slug": "regular-40-04",
    "title": "校园安全 Q4",
    "part": "Part 1",
    "prompt": "Should universities teach safety education more seriously?",
    "followUps": [],
    "tags": [
      "口语素养",
      "校园安全"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Yes, I think universities should take safety education more seriously. Many students live more independently at university, so they need stronger awareness of personal safety, emergency response, and online protection. Safety education should be practical and relevant to real situations. In my opinion, it is an important part of student development.",
    "sectionLabel": "校园安全",
    "isRequired": false,
    "categoryId": "regular-category-40",
    "categorySlug": "category-40",
    "categoryTitle": "校园安全",
    "sortOrder": 4
  },
  {
    "id": "regular-40-05",
    "slug": "regular-40-05",
    "title": "校园安全 Q5",
    "part": "Part 1",
    "prompt": "How can students protect themselves better?",
    "followUps": [],
    "tags": [
      "口语素养",
      "校园安全"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Students can protect themselves better by staying alert, following rules, avoiding unnecessary risks, and learning basic safety knowledge. They should also be careful online, pay attention to mental health, and ask for help when needed. In my opinion, awareness and prevention are more effective than waiting until something goes wrong.",
    "sectionLabel": "校园安全",
    "isRequired": false,
    "categoryId": "regular-category-40",
    "categorySlug": "category-40",
    "categoryTitle": "校园安全",
    "sortOrder": 5
  },
  {
    "id": "regular-41-01",
    "slug": "regular-41-01",
    "title": "时间的价值 Q1",
    "part": "Part 1",
    "prompt": "Why is time valuable?",
    "followUps": [],
    "tags": [
      "口语素养",
      "时间的价值"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Time is valuable because it is limited and cannot be recovered once it is lost. Unlike money or other resources, time cannot be stored or replaced. The way people use time often affects their growth, achievements, and quality of life. In my opinion, understanding the value of time is essential for living responsibly.",
    "sectionLabel": "时间的价值",
    "isRequired": false,
    "categoryId": "regular-category-41",
    "categorySlug": "category-41",
    "categoryTitle": "时间的价值",
    "sortOrder": 1
  },
  {
    "id": "regular-41-02",
    "slug": "regular-41-02",
    "title": "时间的价值 Q2",
    "part": "Part 1",
    "prompt": "Do young people waste too much time?",
    "followUps": [],
    "tags": [
      "口语素养",
      "时间的价值"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Sometimes I think young people do waste too much time, especially because modern life offers many distractions such as phones, entertainment, and social media. However, I also think this is not only a problem for young people, but for many people in general. In my opinion, wasting time often happens when people do not have clear goals or good habits.",
    "sectionLabel": "时间的价值",
    "isRequired": false,
    "categoryId": "regular-category-41",
    "categorySlug": "category-41",
    "categoryTitle": "时间的价值",
    "sortOrder": 2
  },
  {
    "id": "regular-41-03",
    "slug": "regular-41-03",
    "title": "时间的价值 Q3",
    "part": "Part 1",
    "prompt": "How can students use time more meaningfully?",
    "followUps": [],
    "tags": [
      "口语素养",
      "时间的价值"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Students can use time more meaningfully by setting priorities, planning tasks, and balancing work with rest. Meaningful use of time does not mean being busy every minute. It means making choices that support personal growth, health, and long-term goals. In my opinion, wise time use comes from awareness and discipline.",
    "sectionLabel": "时间的价值",
    "isRequired": false,
    "categoryId": "regular-category-41",
    "categorySlug": "category-41",
    "categoryTitle": "时间的价值",
    "sortOrder": 3
  },
  {
    "id": "regular-41-04",
    "slug": "regular-41-04",
    "title": "时间的价值 Q4",
    "part": "Part 1",
    "prompt": "What activities are worth spending time on?",
    "followUps": [],
    "tags": [
      "口语素养",
      "时间的价值"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Activities that are worth spending time on are those that improve a person’s knowledge, health, relationships, or emotional well-being. Studying, exercising, meaningful conversation, and rest can all be valuable depending on the situation. In my opinion, time should be spent on things that contribute to a better and more balanced life.",
    "sectionLabel": "时间的价值",
    "isRequired": false,
    "categoryId": "regular-category-41",
    "categorySlug": "category-41",
    "categoryTitle": "时间的价值",
    "sortOrder": 4
  },
  {
    "id": "regular-41-05",
    "slug": "regular-41-05",
    "title": "时间的价值 Q5",
    "part": "Part 1",
    "prompt": "How does good time use affect the future?",
    "followUps": [],
    "tags": [
      "口语素养",
      "时间的价值"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Good time use affects the future because small daily choices gradually shape a person’s abilities, habits, and opportunities. People who use time wisely usually become more prepared, more disciplined, and less stressed in the long run. In my opinion, the future is often built through how we use time in the present.",
    "sectionLabel": "时间的价值",
    "isRequired": false,
    "categoryId": "regular-category-41",
    "categorySlug": "category-41",
    "categoryTitle": "时间的价值",
    "sortOrder": 5
  },
  {
    "id": "regular-42-01",
    "slug": "regular-42-01",
    "title": "失败与挫折 Q1",
    "part": "Part 1",
    "prompt": "Do you think failure is part of success?",
    "followUps": [],
    "tags": [
      "口语素养",
      "失败与挫折"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Yes, I think failure is often part of success because it teaches people important lessons that success alone cannot provide. Failure can show weaknesses, reveal problems, and encourage people to improve their methods. Although it can be painful, it often helps people grow stronger and wiser. In my opinion, success without learning from failure is incomplete.",
    "sectionLabel": "失败与挫折",
    "isRequired": false,
    "categoryId": "regular-category-42",
    "categorySlug": "category-42",
    "categoryTitle": "失败与挫折",
    "sortOrder": 1
  },
  {
    "id": "regular-42-02",
    "slug": "regular-42-02",
    "title": "失败与挫折 Q2",
    "part": "Part 1",
    "prompt": "How should people deal with setbacks?",
    "followUps": [],
    "tags": [
      "口语素养",
      "失败与挫折"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "People should deal with setbacks by staying calm, reflecting honestly on what went wrong, and trying again with a better strategy. It is natural to feel disappointed, but giving up too quickly often leads to regret. In my opinion, setbacks become meaningful when people use them as opportunities to learn.",
    "sectionLabel": "失败与挫折",
    "isRequired": false,
    "categoryId": "regular-category-42",
    "categorySlug": "category-42",
    "categoryTitle": "失败与挫折",
    "sortOrder": 2
  },
  {
    "id": "regular-42-03",
    "slug": "regular-42-03",
    "title": "失败与挫折 Q3",
    "part": "Part 1",
    "prompt": "Why are some people afraid of failure?",
    "followUps": [],
    "tags": [
      "口语素养",
      "失败与挫折"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Some people are afraid of failure because they worry about losing confidence, disappointing others, or being judged negatively. In competitive environments, failure can feel especially stressful. However, I think this fear is understandable but not always helpful. In my opinion, people should see failure as a normal part of growth rather than a final judgment.",
    "sectionLabel": "失败与挫折",
    "isRequired": false,
    "categoryId": "regular-category-42",
    "categorySlug": "category-42",
    "categoryTitle": "失败与挫折",
    "sortOrder": 3
  },
  {
    "id": "regular-42-04",
    "slug": "regular-42-04",
    "title": "失败与挫折 Q4",
    "part": "Part 1",
    "prompt": "Can failure make people stronger?",
    "followUps": [],
    "tags": [
      "口语素养",
      "失败与挫折"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Yes, I think failure can make people stronger if they respond to it in the right way. When people learn from failure instead of being defeated by it, they can develop resilience, patience, and self-awareness. In my opinion, personal strength often comes from overcoming difficulty rather than avoiding it.",
    "sectionLabel": "失败与挫折",
    "isRequired": false,
    "categoryId": "regular-category-42",
    "categorySlug": "category-42",
    "categoryTitle": "失败与挫折",
    "sortOrder": 4
  },
  {
    "id": "regular-42-05",
    "slug": "regular-42-05",
    "title": "失败与挫折 Q5",
    "part": "Part 1",
    "prompt": "What can students learn from academic failure?",
    "followUps": [],
    "tags": [
      "口语素养",
      "失败与挫折"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Students can learn many things from academic failure, such as the importance of preparation, time management, and honest self-evaluation. Failure may also help them understand that success requires consistent effort rather than last-minute work. In my opinion, academic setbacks can become valuable learning experiences if students face them constructively.",
    "sectionLabel": "失败与挫折",
    "isRequired": false,
    "categoryId": "regular-category-42",
    "categorySlug": "category-42",
    "categoryTitle": "失败与挫折",
    "sortOrder": 5
  },
  {
    "id": "regular-43-01",
    "slug": "regular-43-01",
    "title": "自信与心理成长 Q1",
    "part": "Part 1",
    "prompt": "Why is self-confidence important?",
    "followUps": [],
    "tags": [
      "口语素养",
      "自信与心理成长"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Self-confidence is important because it helps people believe in their ability to face challenges and try new things. Without confidence, people may hesitate too much and miss valuable opportunities. Confidence also affects communication, decision making, and emotional stability. In my opinion, healthy self-confidence is a key part of personal growth.",
    "sectionLabel": "自信与心理成长",
    "isRequired": false,
    "categoryId": "regular-category-43",
    "categorySlug": "category-43",
    "categoryTitle": "自信与心理成长",
    "sortOrder": 1
  },
  {
    "id": "regular-43-02",
    "slug": "regular-43-02",
    "title": "自信与心理成长 Q2",
    "part": "Part 1",
    "prompt": "How can students become more confident?",
    "followUps": [],
    "tags": [
      "口语素养",
      "自信与心理成长"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Students can become more confident by gaining real experience, improving their skills, and recognizing their progress step by step. Confidence usually does not come from empty words, but from repeated effort and small successes. It is also important to accept mistakes without losing self-respect. In my opinion, confidence grows through action and reflection.",
    "sectionLabel": "自信与心理成长",
    "isRequired": false,
    "categoryId": "regular-category-43",
    "categorySlug": "category-43",
    "categoryTitle": "自信与心理成长",
    "sortOrder": 2
  },
  {
    "id": "regular-43-03",
    "slug": "regular-43-03",
    "title": "自信与心理成长 Q3",
    "part": "Part 1",
    "prompt": "What is the difference between confidence and arrogance?",
    "followUps": [],
    "tags": [
      "口语素养",
      "自信与心理成长"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Confidence means believing in yourself while still respecting others, while arrogance means thinking too highly of yourself and looking down on other people. A confident person is usually calm and open-minded, but an arrogant person often lacks humility. In my opinion, true confidence includes self-awareness and respect.",
    "sectionLabel": "自信与心理成长",
    "isRequired": false,
    "categoryId": "regular-category-43",
    "categorySlug": "category-43",
    "categoryTitle": "自信与心理成长",
    "sortOrder": 3
  },
  {
    "id": "regular-43-04",
    "slug": "regular-43-04",
    "title": "自信与心理成长 Q4",
    "part": "Part 1",
    "prompt": "Can praise help build confidence?",
    "followUps": [],
    "tags": [
      "口语素养",
      "自信与心理成长"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Yes, praise can help build confidence, especially when it is sincere and based on real effort or improvement. Positive feedback can encourage people and help them recognize their strengths. However, praise should not be empty or excessive. In my opinion, the best praise supports growth rather than creating false confidence.",
    "sectionLabel": "自信与心理成长",
    "isRequired": false,
    "categoryId": "regular-category-43",
    "categorySlug": "category-43",
    "categoryTitle": "自信与心理成长",
    "sortOrder": 4
  },
  {
    "id": "regular-43-05",
    "slug": "regular-43-05",
    "title": "自信与心理成长 Q5",
    "part": "Part 1",
    "prompt": "How does confidence affect communication?",
    "followUps": [],
    "tags": [
      "口语素养",
      "自信与心理成长"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Confidence affects communication because people who believe in themselves are more likely to express ideas clearly and interact naturally with others. Lack of confidence may cause hesitation, fear of judgment, or avoidance of speaking. In my opinion, communication becomes much more effective when confidence and preparation work together.",
    "sectionLabel": "自信与心理成长",
    "isRequired": false,
    "categoryId": "regular-category-43",
    "categorySlug": "category-43",
    "categoryTitle": "自信与心理成长",
    "sortOrder": 5
  },
  {
    "id": "regular-44-01",
    "slug": "regular-44-01",
    "title": "学习方法与效率 Q1",
    "part": "Part 1",
    "prompt": "What makes a study method effective?",
    "followUps": [],
    "tags": [
      "口语素养",
      "学习方法与效率"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "A study method becomes effective when it matches the learner’s needs and helps them understand, remember, and apply knowledge well. Good study methods often include planning, active review, and regular practice rather than passive reading alone. In my opinion, an effective method is not just about working hard, but also about working in a smart and organized way.",
    "sectionLabel": "学习方法与效率",
    "isRequired": false,
    "categoryId": "regular-category-44",
    "categorySlug": "category-44",
    "categoryTitle": "学习方法与效率",
    "sortOrder": 1
  },
  {
    "id": "regular-44-02",
    "slug": "regular-44-02",
    "title": "学习方法与效率 Q2",
    "part": "Part 1",
    "prompt": "Do all students need the same study method?",
    "followUps": [],
    "tags": [
      "口语素养",
      "学习方法与效率"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "No, I do not think all students need the same study method. Different people have different habits, strengths, and ways of understanding information. Some may learn better through notes and review, while others may prefer discussion or practice. In my opinion, the best study method is the one that fits the learner and produces real results.",
    "sectionLabel": "学习方法与效率",
    "isRequired": false,
    "categoryId": "regular-category-44",
    "categorySlug": "category-44",
    "categoryTitle": "学习方法与效率",
    "sortOrder": 2
  },
  {
    "id": "regular-44-03",
    "slug": "regular-44-03",
    "title": "学习方法与效率 Q3",
    "part": "Part 1",
    "prompt": "How can students improve study efficiency?",
    "followUps": [],
    "tags": [
      "口语素养",
      "学习方法与效率"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Students can improve study efficiency by setting clear goals, reducing distractions, and using active learning methods such as summarizing, questioning, and reviewing regularly. It is also important to rest properly because tired minds do not work efficiently. In my opinion, efficiency comes from focus, planning, and consistency.",
    "sectionLabel": "学习方法与效率",
    "isRequired": false,
    "categoryId": "regular-category-44",
    "categorySlug": "category-44",
    "categoryTitle": "学习方法与效率",
    "sortOrder": 3
  },
  {
    "id": "regular-44-04",
    "slug": "regular-44-04",
    "title": "学习方法与效率 Q4",
    "part": "Part 1",
    "prompt": "Is studying for a long time always useful?",
    "followUps": [],
    "tags": [
      "口语素养",
      "学习方法与效率"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "No, studying for a long time is not always useful if a person is tired, distracted, or using ineffective methods. Quality is often more important than quantity. Focused study for a reasonable period can be much more productive than many hours of passive work. In my opinion, smart study is better than simply long study.",
    "sectionLabel": "学习方法与效率",
    "isRequired": false,
    "categoryId": "regular-category-44",
    "categorySlug": "category-44",
    "categoryTitle": "学习方法与效率",
    "sortOrder": 4
  },
  {
    "id": "regular-44-05",
    "slug": "regular-44-05",
    "title": "学习方法与效率 Q5",
    "part": "Part 1",
    "prompt": "Should students review regularly or only before exams?",
    "followUps": [],
    "tags": [
      "口语素养",
      "学习方法与效率"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Students should definitely review regularly rather than only before exams. Regular review helps knowledge stay in memory and reduces stress when exams approach. Last-minute study may help in the short term, but it is usually less effective for true understanding. In my opinion, regular review is one of the best habits for academic success.",
    "sectionLabel": "学习方法与效率",
    "isRequired": false,
    "categoryId": "regular-category-44",
    "categorySlug": "category-44",
    "categoryTitle": "学习方法与效率",
    "sortOrder": 5
  },
  {
    "id": "regular-45-01",
    "slug": "regular-45-01",
    "title": "人与自然的关系 Q1",
    "part": "Part 1",
    "prompt": "What is the relationship between humans and nature?",
    "followUps": [],
    "tags": [
      "口语素养",
      "人与自然的关系"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Humans and nature are deeply connected because people depend on natural resources for survival, health, and development. At the same time, human activities strongly affect the natural environment. This relationship should be based on respect and balance rather than excessive exploitation. In my opinion, understanding this connection is essential for the future.",
    "sectionLabel": "人与自然的关系",
    "isRequired": false,
    "categoryId": "regular-category-45",
    "categorySlug": "category-45",
    "categoryTitle": "人与自然的关系",
    "sortOrder": 1
  },
  {
    "id": "regular-45-02",
    "slug": "regular-45-02",
    "title": "人与自然的关系 Q2",
    "part": "Part 1",
    "prompt": "Why should people respect nature?",
    "followUps": [],
    "tags": [
      "口语素养",
      "人与自然的关系"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "People should respect nature because nature provides the foundation for life. Clean air, water, food, and ecological balance all come from a healthy natural environment. If people ignore or damage nature, the consequences will eventually affect human society as well. In my opinion, respect for nature is also respect for ourselves and future generations.",
    "sectionLabel": "人与自然的关系",
    "isRequired": false,
    "categoryId": "regular-category-45",
    "categorySlug": "category-45",
    "categoryTitle": "人与自然的关系",
    "sortOrder": 2
  },
  {
    "id": "regular-45-03",
    "slug": "regular-45-03",
    "title": "人与自然的关系 Q3",
    "part": "Part 1",
    "prompt": "How has modern life changed people’s relationship with nature?",
    "followUps": [],
    "tags": [
      "口语素养",
      "人与自然的关系"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Modern life has made many people less directly connected to nature because they spend more time indoors, in cities, and with digital devices. At the same time, modern industry and consumption have increased pressure on the environment. However, I think modern life has also made more people aware of environmental issues. In my opinion, the challenge is to rebuild a healthier relationship with nature.",
    "sectionLabel": "人与自然的关系",
    "isRequired": false,
    "categoryId": "regular-category-45",
    "categorySlug": "category-45",
    "categoryTitle": "人与自然的关系",
    "sortOrder": 3
  },
  {
    "id": "regular-45-04",
    "slug": "regular-45-04",
    "title": "人与自然的关系 Q4",
    "part": "Part 1",
    "prompt": "What can students do to get closer to nature?",
    "followUps": [],
    "tags": [
      "口语素养",
      "人与自然的关系"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Students can get closer to nature by spending more time outdoors, learning about environmental issues, and developing habits that show respect for the natural world. Simple activities such as walking in parks, reducing waste, or joining environmental programs can make a difference. In my opinion, connection with nature begins with awareness and daily action.",
    "sectionLabel": "人与自然的关系",
    "isRequired": false,
    "categoryId": "regular-category-45",
    "categorySlug": "category-45",
    "categoryTitle": "人与自然的关系",
    "sortOrder": 4
  },
  {
    "id": "regular-45-05",
    "slug": "regular-45-05",
    "title": "人与自然的关系 Q5",
    "part": "Part 1",
    "prompt": "Do you think modern people still need nature in daily life?",
    "followUps": [],
    "tags": [
      "口语素养",
      "人与自然的关系"
    ],
    "timeLimitLabel": "45-60 sec",
    "sampleAnswer": "Yes, I think modern people still need nature very much, even if daily life has become more technological. Nature provides not only physical resources, but also emotional and mental benefits. Time spent in natural environments can reduce stress and improve well-being. In my opinion, no matter how modern society becomes, people still need a meaningful connection with nature.",
    "sectionLabel": "人与自然的关系",
    "isRequired": false,
    "categoryId": "regular-category-45",
    "categorySlug": "category-45",
    "categoryTitle": "人与自然的关系",
    "sortOrder": 5
  }
];

export const regularEnglishCategories: RegularEnglishCategory[] = [
  {
    "id": "regular-category-01",
    "slug": "category-01",
    "title": "自我介绍",
    "questionCount": 5
  },
  {
    "id": "regular-category-02",
    "slug": "category-02",
    "title": "家庭朋友",
    "questionCount": 5
  },
  {
    "id": "regular-category-03",
    "slug": "category-03",
    "title": "学校生活",
    "questionCount": 5
  },
  {
    "id": "regular-category-04",
    "slug": "category-04",
    "title": "专业学习",
    "questionCount": 5
  },
  {
    "id": "regular-category-05",
    "slug": "category-05",
    "title": "兴趣爱好",
    "questionCount": 5
  },
  {
    "id": "regular-category-06",
    "slug": "category-06",
    "title": "旅游经历",
    "questionCount": 5
  },
  {
    "id": "regular-category-07",
    "slug": "category-07",
    "title": "食物与健康",
    "questionCount": 5
  },
  {
    "id": "regular-category-08",
    "slug": "category-08",
    "title": "科技与AI",
    "questionCount": 5
  },
  {
    "id": "regular-category-09",
    "slug": "category-09",
    "title": "环境保护",
    "questionCount": 5
  },
  {
    "id": "regular-category-10",
    "slug": "category-10",
    "title": "社交媒体",
    "questionCount": 5
  },
  {
    "id": "regular-category-11",
    "slug": "category-11",
    "title": "未来职业规划",
    "questionCount": 5
  },
  {
    "id": "regular-category-12",
    "slug": "category-12",
    "title": "校园活动",
    "questionCount": 5
  },
  {
    "id": "regular-category-13",
    "slug": "category-13",
    "title": "图书馆 / 宿舍 / 课堂",
    "questionCount": 5
  },
  {
    "id": "regular-category-14",
    "slug": "category-14",
    "title": "团队合作",
    "questionCount": 5
  },
  {
    "id": "regular-category-15",
    "slug": "category-15",
    "title": "压力与时间管理",
    "questionCount": 5
  },
  {
    "id": "regular-category-16",
    "slug": "category-16",
    "title": "电影与电视剧",
    "questionCount": 5
  },
  {
    "id": "regular-category-17",
    "slug": "category-17",
    "title": "音乐与艺术",
    "questionCount": 5
  },
  {
    "id": "regular-category-18",
    "slug": "category-18",
    "title": "阅读与书籍",
    "questionCount": 5
  },
  {
    "id": "regular-category-19",
    "slug": "category-19",
    "title": "网络学习与在线课程",
    "questionCount": 5
  },
  {
    "id": "regular-category-20",
    "slug": "category-20",
    "title": "手机与数字生活",
    "questionCount": 5
  },
  {
    "id": "regular-category-21",
    "slug": "category-21",
    "title": "节日与传统文化",
    "questionCount": 5
  },
  {
    "id": "regular-category-22",
    "slug": "category-22",
    "title": "兼职与社会实践",
    "questionCount": 5
  },
  {
    "id": "regular-category-23",
    "slug": "category-23",
    "title": "公共交通与城市生活",
    "questionCount": 5
  },
  {
    "id": "regular-category-24",
    "slug": "category-24",
    "title": "志愿服务与帮助他人",
    "questionCount": 5
  },
  {
    "id": "regular-category-25",
    "slug": "category-25",
    "title": "健身与运动",
    "questionCount": 5
  },
  {
    "id": "regular-category-26",
    "slug": "category-26",
    "title": "消费与理财",
    "questionCount": 5
  },
  {
    "id": "regular-category-27",
    "slug": "category-27",
    "title": "社会责任与公民意识",
    "questionCount": 5
  },
  {
    "id": "regular-category-28",
    "slug": "category-28",
    "title": "交流能力与沟通技巧",
    "questionCount": 5
  },
  {
    "id": "regular-category-29",
    "slug": "category-29",
    "title": "幸福感与生活质量",
    "questionCount": 5
  },
  {
    "id": "regular-category-30",
    "slug": "category-30",
    "title": "梦想与个人成长",
    "questionCount": 5
  },
  {
    "id": "regular-category-31",
    "slug": "category-31",
    "title": "网络购物",
    "questionCount": 5
  },
  {
    "id": "regular-category-32",
    "slug": "category-32",
    "title": "语言学习",
    "questionCount": 5
  },
  {
    "id": "regular-category-33",
    "slug": "category-33",
    "title": "宠物与动物",
    "questionCount": 5
  },
  {
    "id": "regular-category-34",
    "slug": "category-34",
    "title": "天气与气候",
    "questionCount": 5
  },
  {
    "id": "regular-category-35",
    "slug": "category-35",
    "title": "自律与习惯养成",
    "questionCount": 5
  },
  {
    "id": "regular-category-36",
    "slug": "category-36",
    "title": "偶像与榜样",
    "questionCount": 5
  },
  {
    "id": "regular-category-37",
    "slug": "category-37",
    "title": "创新与创造力",
    "questionCount": 5
  },
  {
    "id": "regular-category-38",
    "slug": "category-38",
    "title": "规则与自由",
    "questionCount": 5
  },
  {
    "id": "regular-category-39",
    "slug": "category-39",
    "title": "人工智能伦理",
    "questionCount": 5
  },
  {
    "id": "regular-category-40",
    "slug": "category-40",
    "title": "校园安全",
    "questionCount": 5
  },
  {
    "id": "regular-category-41",
    "slug": "category-41",
    "title": "时间的价值",
    "questionCount": 5
  },
  {
    "id": "regular-category-42",
    "slug": "category-42",
    "title": "失败与挫折",
    "questionCount": 5
  },
  {
    "id": "regular-category-43",
    "slug": "category-43",
    "title": "自信与心理成长",
    "questionCount": 5
  },
  {
    "id": "regular-category-44",
    "slug": "category-44",
    "title": "学习方法与效率",
    "questionCount": 5
  },
  {
    "id": "regular-category-45",
    "slug": "category-45",
    "title": "人与自然的关系",
    "questionCount": 5
  }
];

export function getRegularEnglishCategoryBySlug(slug: string) {
  return regularEnglishCategories.find((category) => category.slug === slug);
}

export function getRegularEnglishQuestionBySlug(slug: string) {
  return regularEnglishQuestions.find((question) => question.slug === slug);
}

export function getRegularEnglishQuestionById(id: string) {
  return regularEnglishQuestions.find((question) => question.id === id);
}

export function getRegularEnglishQuestionsByCategorySlug(categorySlug: string) {
  return regularEnglishQuestions.filter((question) => question.categorySlug === categorySlug);
}

export function getRandomRegularEnglishQuestion(categorySlug: string, excludeSlug?: string) {
  const matches = getRegularEnglishQuestionsByCategorySlug(categorySlug);
  if (!matches.length) {
    return null;
  }

  const filtered = excludeSlug ? matches.filter((question) => question.slug !== excludeSlug) : matches;
  const pool = filtered.length ? filtered : matches;
  const index = Math.floor(Math.random() * pool.length);
  return pool[index] ?? pool[0] ?? null;
}
